"use client";

/**
 * A physics-driven ID badge on a lanyard, from React Bits
 * (https://reactbits.dev/components/lanyard), adapted for this site:
 *
 * - The `.glb` and the card artwork are fetched from `/public` by URL.
 *   Upstream imports them as modules, which needs a bundler asset loader Next
 *   does not have for `.glb`.
 * - Artwork is drawn at the card's own proportions. The model's texture slot
 *   is a different shape from the face it maps onto, so anything composited
 *   into it arrives ~8% wide unless it is squeezed first; `drawFitted` does
 *   that, which upstream never had to because its own artwork was authored
 *   pre-squeezed.
 * - The camera is driven from pixel targets rather than a fixed position, so
 *   the badge renders at the same size wherever the canvas is put. See
 *   `FrameBadge`.
 * - The canvas is not a box in the layout at all. It is fixed to the whole
 *   viewport and the camera tracks an anchor element, so the badge scrolls
 *   with the page while having no edge of its own to be clipped against. The
 *   pointer gate in `Band` is what stops a layer that size from swallowing
 *   the page's own clicks.
 * - The card face is unlit, so printed artwork comes out the far side the
 *   colour it went in.
 * - Nothing loads a texture it will not draw. Upstream keeps its hook count
 *   fixed by loading a blank data URI in place of any image left unset, which
 *   both wastes a request and, in this app, fails outright. The material that
 *   needs a texture is its own component here instead, so a face with no
 *   artwork simply never asks for one.
 */

import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  Canvas,
  extend,
  useFrame,
  type ThreeElement,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import {
  MeshLineGeometry,
  MeshLineMaterial,
  type MeshLineMaterialParameters,
} from "meshline";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

const CARD_MODEL = "/lanyard/card.glb";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

/**
 * The rig, in world units, measured off card.glb and the joints below.
 *
 * The card mesh is 0.7164 x 1.0 at a group scale of 2.25. It hangs from a
 * fixed anchor at y=4 on three rope joints of length 1, plus the 1.45 the
 * spherical joint holds it below the last of them — so once it settles, its
 * centre is a hair under half a unit below the origin.
 */
const CARD_SIZE = { width: 1.612, height: 2.25 };
const ANCHOR_Y = 4;
const REST_Y = -0.474;

/**
 * What a loaded texture's `.image` actually is. three types it as `any`, but
 * every source this component sees — the decoded PNGs and the atlas out of the
 * glb — is an element canvas2d can draw and measure.
 */
type DrawableImage = CanvasImageSource & { width: number; height: number };

interface LanyardProps {
  /**
   * The element the badge hangs over. Its box is read every frame, so the
   * badge follows the layout and the scroll without the canvas having to be
   * anywhere near it.
   */
  anchorRef: RefObject<HTMLElement | null>;
  /** On-screen height of the badge, in CSS pixels. */
  cardHeight: number;
  /** The settled badge's centre, in CSS pixels below the anchor's top edge. */
  cardOffsetTop: number;
  /**
   * Whether to run at all. A viewport-sized canvas is not free to redraw, and
   * there is nothing to draw once the anchor has scrolled away.
   */
  active?: boolean;
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardWidth?: number;
  bandColor?: string;
  className?: string;
}

export default function Lanyard({
  anchorRef,
  cardHeight,
  cardOffsetTop,
  active = true,
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardWidth = 1,
  bandColor = "#ffffff",
  className,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    // The whole viewport, and inert by default. Sizing this to the badge is
    // what put an edge on it to clip against, so it has none: it is pinned to
    // the viewport instead, and `FrameBadge` moves the camera to keep the
    // badge over the anchor. `pointer-events` is resolved per element rather
    // than inherited as a barrier, so the canvas inside can put itself back to
    // `auto` when the badge is under the mouse, while the rest of a layer that
    // now covers the entire page stays click-through.
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <Canvas
        // A starting point only; `FrameBadge` sets the real position from the
        // anchor's box. `rotation` is passed for its side effect: without it
        // R3F aims the default camera at the origin, which would turn every
        // offset into a tilt.
        camera={{ position: [0, 0, 14], fov, rotation: [0, 0, 0] }}
        frameloop={active ? "always" : "never"}
        // R3F gives its own container `pointer-events: auto`, which over a
        // layer this size would take every click on the page. `style` is
        // spread last there, so this is the supported way to overrule it; the
        // canvas inside inherits it, and the gate raises the canvas alone.
        style={{ pointerEvents: "none" }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <FrameBadge
          anchorRef={anchorRef}
          cardHeight={cardHeight}
          cardOffsetTop={cardOffsetTop}
          fov={fov}
        />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardWidth={lanyardWidth}
            bandColor={bandColor}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/**
 * Aims a viewport-sized canvas at an element on the page.
 *
 * The badge is not drawn where the canvas is; it is drawn where the anchor is.
 * Each frame the anchor's box is measured and the camera moved so the settled
 * badge lands over it at a fixed pixel size — which makes the badge scroll and
 * reflow with the layout while the canvas itself never has to move, resize, or
 * be big enough for wherever the strap swings next.
 */
function FrameBadge({
  anchorRef,
  cardHeight,
  cardOffsetTop,
  fov,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  cardHeight: number;
  cardOffsetTop: number;
  fov: number;
}) {
  // The camera is reached through the frame callback rather than `useThree`
  // because it is being written to, and a value handed back by a hook is not
  // ours to write to during render. Subscribers run ahead of the draw, so a
  // scroll never shows a frame at the old position.
  const projection = useRef("");

  useFrame(({ camera, size }) => {
    const anchor = anchorRef.current;
    if (!anchor || !(camera instanceof THREE.PerspectiveCamera)) return;

    const pixelsPerUnit = cardHeight / CARD_SIZE.height;
    const worldHeight = size.height / pixelsPerUnit;

    // Only the lens needs recomputing when something other than the scroll
    // changes; the position below is a few multiplies and is set every frame.
    const key = [size.width, size.height, cardHeight, fov].join();
    if (projection.current !== key) {
      projection.current = key;
      camera.fov = fov;
      camera.rotation.set(0, 0, 0);
      camera.updateProjectionMatrix();
    }

    // `getBoundingClientRect` is already viewport-relative, so scrolling needs
    // no arithmetic of its own — the anchor simply reports a new top.
    const box = anchor.getBoundingClientRect();
    const targetX = box.left + box.width / 2;
    const targetY = box.top + cardOffsetTop;

    // Moving the camera right slides the scene left, hence the flipped sign on
    // x against y.
    camera.position.set(
      (size.width / 2 - targetX) / pixelsPerUnit,
      REST_Y + (targetY - size.height / 2) / pixelsPerUnit,
      worldHeight / (2 * Math.tan((fov * Math.PI) / 360)),
    );
  });

  return null;
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardWidth?: number;
  bandColor?: string;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardWidth = 1,
  bandColor = "#ffffff",
}: BandProps) {
  const band =
    useRef<
      THREE.Mesh<
        InstanceType<typeof MeshLineGeometry>,
        InstanceType<typeof MeshLineMaterial>
      >
    >(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const projected = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(CARD_MODEL);
  const cardMesh = nodes.card as THREE.Mesh;
  const clipMesh = nodes.clip as THREE.Mesh;
  const clampMesh = nodes.clamp as THREE.Mesh;
  const baseMaterial = materials.base as THREE.MeshStandardMaterial;

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  // The pointer gate. The canvas is a wide layer sitting over the copy, and
  // its wrapper hands it `pointer-events: none` so the page underneath stays
  // live; the frame loop lifts that back to `auto` for exactly the moments the
  // mouse is over the badge, which is the only part of the layer there is
  // anything to click.
  useEffect(() => {
    const track = (event: PointerEvent) => {
      // Touch is deliberately left out. A canvas that accepts touch across the
      // reading column is a canvas that eats the page's scrolling, and the
      // badge is not worth that trade on a phone.
      if (event.pointerType !== "mouse" || !canvas.current) return;

      const box = canvas.current.getBoundingClientRect();
      pointer.current = {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      };
    };

    window.addEventListener("pointermove", track, { passive: true });
    return () => window.removeEventListener("pointermove", track);
  }, []);

  /** Whether the mouse is over the badge, and so whether the layer is live. */
  const overCard = (
    size: { width: number; height: number },
    pixelsPerUnit: number,
    camera: THREE.Camera,
  ) => {
    // Mid-drag the pointer wanders off the card, and letting go of the layer
    // there would drop the badge on the spot.
    if (dragged) return true;

    const at = pointer.current;
    if (!at) return false;

    const t = card.current.translation();
    projected.set(t.x, t.y, t.z).project(camera);

    const centreX = (projected.x * 0.5 + 0.5) * size.width;
    const centreY = (-projected.y * 0.5 + 0.5) * size.height;

    // A rectangle around the card's rest orientation rather than its true
    // outline: it tilts as it swings, and a little slack is cheaper than
    // projecting four corners every frame.
    const grab = 8;
    return (
      Math.abs(at.x - centreX) < (CARD_SIZE.width / 2) * pixelsPerUnit + grab &&
      Math.abs(at.y - centreY) < (CARD_SIZE.height / 2) * pixelsPerUnit + grab
    );
  };

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, lerped.distanceTo(ref.current.translation())),
        );
        lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true,
      );

      canvas.current = state.gl.domElement;
      canvas.current.style.pointerEvents = overCard(
        state.size,
        state.viewport.factor,
        state.camera,
      )
        ? "auto"
        : "none";
    }
  });

  return (
    <>
      {/* Upstream lays the rope out horizontally, so the badge starts three
          units off to the side and swings in from well beyond the frame. In a
          column this narrow that reads as a glitch, so the rope starts slack
          and nearly vertical instead: the badge drops, overshoots and settles,
          all of it inside the canvas. The card sits where its joint anchor
          already meets j3, so the joint has nothing to correct on step one. */}
      <group position={[0, ANCHOR_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody
          position={[0.18, -0.32, 0]}
          ref={j1}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.3, -0.78, 0]}
          ref={j2}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.38, -1.24, 0]}
          ref={j3}
          {...segmentProps}
          type="dynamic"
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[0.38, -2.69, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={cardMesh.geometry}>
              <CardMaterial
                baseMap={baseMaterial.map}
                frontImage={frontImage}
                backImage={backImage}
                imageFit={imageFit}
              />
            </mesh>
            <mesh
              geometry={clipMesh.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={clampMesh.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <BandMaterial
          isMobile={isMobile}
          lanyardWidth={lanyardWidth}
          bandColor={bandColor}
        />
      </mesh>
    </>
  );
}

/**
 * The card's face.
 *
 * Unlit, and out of the tone mapper's reach: the face is printed artwork, not
 * a surface. Every lit material three offers ties the photograph's colour to
 * the rig's lights, and lighting bright enough to read the card at all was
 * washing it out. This hands the texture to the screen as authored. The clip
 * and clamp keep their lit metal, which is what still reads as depth.
 */
function CardMaterial({
  baseMap,
  frontImage,
  backImage,
  imageFit,
}: {
  baseMap: THREE.Texture | null;
  frontImage: string | null;
  backImage: string | null;
  imageFit: "cover" | "contain";
}) {
  // No hooks above this line, so the branch is safe: each arm is its own
  // component with its own fixed hook order.
  if (!baseMap || (!frontImage && !backImage)) {
    return <meshBasicMaterial map={baseMap} map-anisotropy={16} toneMapped={false} />;
  }

  return (
    <CompositeCardMaterial
      baseMap={baseMap}
      frontImage={frontImage}
      backImage={backImage}
      imageFit={imageFit}
    />
  );
}

/**
 * Draws the supplied artwork into the model's own texture atlas — front on the
 * left half, back on the right — so the two faces stay independent and neither
 * is stretched to fit.
 */
function CompositeCardMaterial({
  baseMap,
  frontImage,
  backImage,
  imageFit,
}: {
  baseMap: THREE.Texture;
  frontImage: string | null;
  backImage: string | null;
  imageFit: "cover" | "contain";
}) {
  // One `useTexture` call whatever the count, so the hook order holds while
  // the list itself can be one image or two.
  const sources = useMemo(
    () => [frontImage, backImage].filter((url): url is string => !!url),
    [frontImage, backImage],
  );
  const loaded = useTexture(sources);

  const map = useMemo(() => {
    const front = frontImage ? loaded[0] : null;
    const back = backImage ? loaded[frontImage ? 1 : 0] : null;

    const baseImg = baseMap.image as DrawableImage;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: DrawableImage, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;

      // The atlas slot is not the shape of the face it lands on: 839x1266 of
      // texture is mapped onto a card of 1.612 x 2.25, stretching everything
      // in it ~8% wider. Upstream never had to account for that because its
      // own artwork was drawn pre-squeezed to match. Artwork drawn at the
      // card's real proportions has to be squeezed here instead, or it
      // arrives on the card 8% fat.
      const squeeze = CARD_SIZE.width / CARD_SIZE.height / (rw / rh);
      const fitWidth = img.width / squeeze;

      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / fitWidth, rh / img.height);
      const dw = fitWidth * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (front?.image) drawFitted(front.image as DrawableImage, FRONT_UV_RECT);
    if (back?.image) drawFitted(back.image as DrawableImage, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [baseMap, loaded, frontImage, backImage, imageFit]);

  return <meshBasicMaterial map={map} map-anisotropy={16} toneMapped={false} />;
}

/**
 * The strap: one flat colour, no artwork.
 *
 * Upstream tiles a texture along the band, which is what its `useMap`, `map`
 * and `repeat` uniforms are for. Nothing here prints on the strap, so that
 * whole path — and the second texture load it needed — is gone.
 */
function BandMaterial({
  isMobile,
  lanyardWidth,
  bandColor,
}: {
  isMobile: boolean;
  lanyardWidth: number;
  bandColor: string;
}) {
  // `resolution` is a required constructor parameter, so it goes through
  // `args` rather than as a prop.
  const args = useMemo<[MeshLineMaterialParameters]>(
    () => [{ resolution: new THREE.Vector2(1000, isMobile ? 2000 : 1000) }],
    [isMobile],
  );

  return (
    <meshLineMaterial
      args={args}
      color={bandColor}
      depthTest={false}
      lineWidth={lanyardWidth}
    />
  );
}

useGLTF.preload(CARD_MODEL);
