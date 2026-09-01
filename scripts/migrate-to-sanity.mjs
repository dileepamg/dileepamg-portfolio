import { createClient } from "@sanity/client";
import { createHash } from "node:crypto";
import {
  createReadStream,
  existsSync,
  readFileSync,
} from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

process.loadEnvFile?.(".env.local");

const root = process.cwd();
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const dryRun = process.argv.includes("--dry-run");

if (!projectId || !dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or dataset.");
}

if (!dryRun && !token) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN. Add the temporary Editor token to .env.local.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-24",
  useCdn: false,
});

const assetCache = new Map();

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

const keyFor = (...parts) =>
  createHash("sha1").update(parts.join(":")).digest("hex").slice(0, 12);

function resolveImport(importPath, sourceFile) {
  if (importPath.startsWith("@/")) {
    return path.join(root, importPath.slice(2));
  }

  return path.resolve(path.dirname(sourceFile), importPath);
}

/**
 * The current content modules import images through Next.js. This evaluates
 * only their data exports while replacing those imports with filesystem
 * markers, so the migration can reuse the existing single source of truth.
 */
function loadDataModule(relativePath) {
  const sourceFile = path.join(root, relativePath);
  let source = readFileSync(sourceFile, "utf8");

  source = source.replace(
    /import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+\.(?:png|jpe?g|webp|gif|mp4))["'];?/g,
    (_match, identifier, importPath) =>
      `const ${identifier} = {__file: ${JSON.stringify(
        resolveImport(importPath, sourceFile),
      )}};`,
  );

  const output = ts.transpileModule(source, {
    fileName: sourceFile,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;

  const moduleScope = { exports: {} };
  vm.runInNewContext(output, {
    module: moduleScope,
    exports: moduleScope.exports,
    console,
    require: (moduleName) => {
      throw new Error(
        `Unexpected runtime import "${moduleName}" in ${relativePath}.`,
      );
    },
  });

  return moduleScope.exports;
}

function fileFrom(source) {
  const file = source?.__file;
  if (!file || !existsSync(file)) {
    throw new Error(`Asset file not found: ${file ?? "unknown"}`);
  }

  return file;
}

async function uploadAsset(kind, file) {
  const cacheKey = `${kind}:${file}`;
  if (assetCache.has(cacheKey)) return assetCache.get(cacheKey);

  if (dryRun) {
    const placeholder = {
      _id: `dry-run-${keyFor(cacheKey)}`,
      url: file,
    };
    assetCache.set(cacheKey, placeholder);
    return placeholder;
  }

  const asset = await client.assets.upload(kind, createReadStream(file), {
    filename: path.basename(file),
  });
  assetCache.set(cacheKey, asset);
  return asset;
}

async function sanityImage(source, alt, caption) {
  const asset = await uploadAsset("image", fileFrom(source));
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt,
    ...(caption ? { caption } : {}),
  };
}

async function optionalImage(file, alt) {
  if (!existsSync(file)) return undefined;
  return sanityImage({ __file: file }, alt);
}

async function caseStudyMedia(media, identity) {
  if (media.kind === "image") {
    return {
      _type: "caseStudyMedia",
      _key: keyFor(identity),
      kind: "image",
      image: await sanityImage(media.src, media.alt),
      orientation: media.orientation ?? "landscape",
      ...(media.caption ? { caption: media.caption } : {}),
    };
  }

  return {
    _type: "caseStudyMedia",
    _key: keyFor(identity),
    kind: "embed",
    embedUrl: media.src,
    embedTitle: media.title,
    ...(media.aspect ? { aspect: media.aspect } : {}),
    ...(media.caption ? { caption: media.caption } : {}),
    ...(media.poster
      ? {
          poster: await sanityImage(
            media.poster,
            `${media.title} preview image`,
          ),
        }
      : {}),
  };
}

async function createOrReplace(document) {
  if (dryRun) {
    console.log(`Would import ${document._type}: ${document._id}`);
    return;
  }

  await client.createOrReplace(document);
  console.log(`Imported ${document._type}: ${document._id}`);
}

async function migrateSettings() {
  const profileImage = await optionalImage(
    path.join(root, "public", "dileepa-g.png"),
    "Dileepa Mahanama Galmangoda",
  );
  const resumeFile = path.join(
    root,
    "public",
    "Dileepa-Galmangoda-Resume.pdf",
  );
  const resumeAsset = await uploadAsset("file", resumeFile);

  await createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Dileepa Galmangoda | Portfolio",
    brandLabel: "Dileepa·G",
    canonicalUrl: "https://dileepa.design",
    author: {
      fullName: "Dileepa Mahanama Galmangoda",
      displayName: "Dileepa Galmangoda",
      givenName: "Dileepa",
      familyName: "Galmangoda",
      jobTitle: "UI/UX Designer & Creative Generalist",
      bio: "I design digital experiences through interfaces that feel like they already understand what you’re trying to do. I’m currently open to new opportunities.",
      ...(profileImage ? { profileImage } : {}),
    },
    email: "dileepagalmangoda@gmail.com",
    resume: {
      _type: "file",
      asset: { _type: "reference", _ref: resumeAsset._id },
      downloadName: "Dileepa-Galmangoda-Resume.pdf",
    },
    socialLinks: [
      ["Email", "mailto:dileepagalmangoda@gmail.com", false],
      ["Behance", "https://www.behance.net/dileepamg", true],
      [
        "LinkedIn",
        "https://www.linkedin.com/in/dileepa-galmangoda/",
        true,
      ],
      ["X", "https://x.com/xaradiyel/", true],
      ["GitHub", "https://github.com/dileepamg", true],
    ].map(([label, href, external], index) => ({
      _type: "link",
      _key: keyFor("social", index),
      label,
      href,
      external,
    })),
    navigation: [
      ["About", "/#about"],
      ["Work", "/#work"],
      ["Experience", "/#experience"],
      ["Blog", "/blog"],
      ["Fun", "/#fun"],
    ].map(([label, href], index) => ({
      _type: "link",
      _key: keyFor("navigation", index),
      label,
      href,
      external: false,
    })),
    footer: {
      copyrightName: "Dileepa Mahanama Galmangoda",
      sourceLabel: "GitHub",
      sourceUrl: "https://github.com/dileepamg/dileepamg-portfolio",
      inspirationLinks: [
        {
          _type: "link",
          _key: keyFor("inspiration", "akhila"),
          label: "Akhila",
          href: "https://akhilaariyachandra.com/",
          external: true,
        },
        {
          _type: "link",
          _key: keyFor("inspiration", "ralph"),
          label: "Ralph",
          href: "https://rcortiz.dev/",
          external: true,
        },
      ],
    },
    defaultSeo: {
      title: "Dileepa Mahanama Galmangoda",
      description:
        "Senior UI/UX Designer & Creative Generalist from Sri Lanka. Specializing in product design, visual design, and motion to build engaging digital experiences.",
      keywords: [
        "UI/UX Designer",
        "Product Designer",
        "Visual Designer",
        "Sri Lanka",
        "Motion Graphics",
        "Dileepa Galmangoda",
      ],
      noIndex: false,
    },
    twitterCreator: "@xaradiyel",
  });

  await createOrReplace({
    _id: "homePage",
    _type: "homePage",
    greetingLatin: "Ayubowan",
    greetingSinhala: "ආයුබෝවන්",
    availabilityText:
      "I’m currently open to new design opportunities and collaborations.",
    workHeading: "Featured Work",
    experienceHeading: "Professional Experience",
    blogHeading: "Blog",
    blogDescription:
      "Stories from things I build in my spare time with friends.",
    motionHeading: "Some Fun Motion Stuff",
    motionDescription:
      "A few playful motion experiments I made along the way.",
  });
}

async function migrateCaseStudies() {
  const { caseStudies } = loadDataModule(
    "components/WorkSection/caseStudies.ts",
  );

  for (const [studyIndex, study] of caseStudies.entries()) {
    const cardMedia = await caseStudyMedia(
      study.media,
      `${study.slug}:card`,
    );
    const heroMedia = study.heroMedia
      ? await caseStudyMedia(study.heroMedia, `${study.slug}:hero`)
      : undefined;

    const chapters = study.chapters
      ? await Promise.all(
          study.chapters.map(async (chapter, chapterIndex) => ({
            _type: "object",
            _key: keyFor(study.slug, "chapter", chapterIndex),
            ...(chapter.id ? { id: chapter.id } : {}),
            title: chapter.title,
            ...(chapter.lede ? { lede: chapter.lede } : {}),
            ...(chapter.list ? { list: chapter.list } : {}),
            body: chapter.body,
            ...(chapter.decisions ? { decisions: chapter.decisions } : {}),
            ...(chapter.media
              ? {
                  media: await Promise.all(
                    chapter.media.map((media, mediaIndex) =>
                      caseStudyMedia(
                        media,
                        `${study.slug}:chapter:${chapterIndex}:${mediaIndex}`,
                      ),
                    ),
                  ),
                }
              : {}),
          })),
        )
      : undefined;

    const gallery = study.gallery
      ? await Promise.all(
          study.gallery.map((media, index) =>
            caseStudyMedia(media, `${study.slug}:gallery:${index}`),
          ),
        )
      : undefined;

    await createOrReplace({
      _id: `caseStudy.${study.slug}`,
      _type: "caseStudy",
      title: study.title,
      ...(study.pageTitle ? { pageTitle: study.pageTitle } : {}),
      slug: { _type: "slug", current: study.slug },
      summary: study.summary,
      description: study.description,
      ...(study.tags ? { tags: study.tags } : {}),
      ...(study.role ? { role: study.role } : {}),
      ...(study.year ? { year: study.year } : {}),
      cardMedia,
      ...(heroMedia ? { heroMedia } : {}),
      ...(study.links ? { links: study.links } : {}),
      ...(study.overview
        ? {
            overview: study.overview.map((item, index) => ({
              _type: "object",
              _key: keyFor(study.slug, "overview", index),
              ...item,
            })),
          }
        : {}),
      ...(study.challenge ? { challenge: study.challenge } : {}),
      ...(study.outcome ? { outcome: study.outcome } : {}),
      ...(study.scope ? { scope: study.scope } : {}),
      ...(study.personas
        ? {
            personas: study.personas.map((persona, index) => ({
              _type: "object",
              _key: keyFor(study.slug, "persona", index),
              ...persona,
            })),
          }
        : {}),
      ...(chapters ? { chapters } : {}),
      ...(gallery ? { gallery } : {}),
      ...(study.reflection ? { reflection: study.reflection } : {}),
      ...(study.disclaimer ? { disclaimer: study.disclaimer } : {}),
      seo: {
        title: study.pageTitle ?? study.title,
        description: study.summary,
        ...(cardMedia.kind === "image" ? { image: cardMedia.image } : {}),
        noIndex: false,
      },
      order: studyIndex,
      hidden: false,
    });
  }
}

async function migrateExternalProjects() {
  const { projects } = loadDataModule("components/WorkSection/data.ts");

  for (const [index, project] of projects.entries()) {
    const slug = slugify(project.title);
    await createOrReplace({
      _id: `externalProject.${slug}`,
      _type: "externalProject",
      title: project.title,
      description: project.description,
      url: project.behance,
      image: await sanityImage(project.image, project.title),
      order: index,
      hidden: false,
    });
  }
}

async function migrateExperience() {
  const { experiences } = loadDataModule(
    "components/ExperienceSection/data.ts",
  );

  for (const [index, experience] of experiences.entries()) {
    const id = slugify(`${experience.company}-${experience.role}`);
    await createOrReplace({
      _id: `experience.${id}`,
      _type: "experience",
      role: experience.role,
      company: experience.company,
      companyUrl: experience.link,
      dateLabel: experience.year,
      logoLight: await sanityImage(
        experience.companylogoLight,
        `${experience.company} logo`,
      ),
      logoDark: await sanityImage(
        experience.companyLogoDark,
        `${experience.company} logo`,
      ),
      responsibilities: experience.responsibility,
      skills: experience.techStacks,
      order: index,
    });
  }
}

async function migrateMotionItems() {
  for (let index = 1; index <= 4; index += 1) {
    const manifestPath = path.join(root, "videos", `vid${index}.mp4.json`);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const playbackId = manifest.providerMetadata?.mux?.playbackId;
    if (!playbackId) {
      throw new Error(`Mux playback ID missing from ${manifestPath}`);
    }

    await createOrReplace({
      _id: `motionItem.${index}`,
      _type: "motionItem",
      title: `Motion experiment ${index}`,
      muxPlaybackId: playbackId,
      order: index - 1,
      hidden: false,
    });
  }
}

const steps = {
  settings: migrateSettings,
  caseStudies: migrateCaseStudies,
  externalProjects: migrateExternalProjects,
  experience: migrateExperience,
  motionItems: migrateMotionItems,
};

/**
 * Every write here is a `createOrReplace`, so a step overwrites whatever is in
 * the dataset with what the local data files say. That is fine for content the
 * files still own, and destructive for anything since edited in Studio, which
 * this repo's `siteSettings` and `homePage` have been. `--only=caseStudies`
 * limits a run to the documents you actually mean to replace.
 */
function selectedSteps() {
  const flag = process.argv.find((arg) => arg.startsWith("--only="));
  if (!flag) return Object.keys(steps);

  const names = flag.slice("--only=".length).split(",").filter(Boolean);
  const unknown = names.filter((name) => !(name in steps));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown --only step(s): ${unknown.join(", ")}. ` +
        `Available: ${Object.keys(steps).join(", ")}.`,
    );
  }

  return names;
}

async function main() {
  const names = selectedSteps();
  console.log(
    `${dryRun ? "Checking" : "Migrating"} ${names.join(", ")} ` +
      `for ${projectId}/${dataset}`,
  );

  for (const name of names) {
    await steps[name]();
  }

  console.log(
    dryRun
      ? `Dry run passed. ${assetCache.size} local assets are ready to upload.`
      : `Migration complete. ${assetCache.size} assets processed.`,
  );
}

await main();
