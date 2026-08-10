import mfactorAuthCreate from "@/media/mfactor-auth-2-create-account.png";
import mfactorAuthPersonalize from "@/media/mfactor-auth-4-personalize.png";
import mfactorAuthSignIn from "@/media/mfactor-auth-1-sign-in.png";
import mfactorAuthVerify from "@/media/mfactor-auth-3-verify-email.png";
import mfactorHero from "@/media/mfactor-hero.png";
import mfactorHomepage from "@/media/mfactor-homepage.png";
import mfactorMapView from "@/media/mfactor-map-view.png";
import mfactorProviderProfile from "@/media/mfactor-provider-profile.png";
import mfactorResources from "@/media/mfactor-resources.png";
import mfactorSearchResults from "@/media/mfactor-search-results.png";
import type { StaticImageData } from "next/image";

/**
 * Media is either a local image import or an embedded iframe
 * (Figma prototype, Loom walkthrough, live demo, etc.).
 *
 * For Figma, use the embed URL rather than the plain share link:
 *   https://embed.figma.com/proto/<fileKey>/<name>?embed-host=share
 *   https://embed.figma.com/design/<fileKey>/<name>?embed-host=share
 * Grab it from Figma via Share → Get embed code, then copy just the src.
 */
export type CaseStudyMedia =
  | {
      kind: "image";
      src: StaticImageData;
      alt: string;
      /** Shown under the image. Say what the reader is looking at. */
      caption?: string;
    }
  | {
      kind: "embed";
      src: string;
      title: string;
      caption?: string;
      /**
       * CSS aspect-ratio for the frame, e.g. "4 / 3". Defaults to 16:9.
       * Long page prototypes need a taller box than 16:9 to be usable.
       */
      aspect?: string;
      /**
       * Still frame shown until the viewer clicks to load. Nothing is
       * requested from the third party before that, so the embed costs
       * nothing on first paint.
       */
      poster?: StaticImageData;
    };

/**
 * Phases label each step of the process spine. Steps render in array order;
 * reuse a phase as often as you need.
 */
export type ProcessPhase =
  | "Discover"
  | "Define"
  | "Ideate"
  | "Design"
  | "Validate";

export type ProcessStep = {
  phase: ProcessPhase;
  title: string;
  /** One string per paragraph. Keep it to two. */
  body: readonly string[];
  media?: readonly CaseStudyMedia[];
  /** Pulled out into a highlighted callout. The "so what" of the step. */
  takeaways?: readonly string[];
};

export type CaseStudy = {
  /** URL segment: /work/<slug> */
  slug: string;
  /** Short name. Used on the home card, the browser tab and OG metadata. */
  title: string;
  /** Longer heading for the project page itself. Falls back to `title`. */
  pageTitle?: string;
  /** Short lead line, used on the card and under the title on the page. */
  summary: string;
  /** The paragraph shown on the home page card. */
  description: string;
  /** Optional badges shown on the project page. Omit for none. */
  tags?: readonly string[];
  role?: string;
  year?: string;
  /** Thumbnail for the home page card. Keep this a still image. */
  media: CaseStudyMedia;
  /** Optional larger media for the top of the project page. An interactive
   *  prototype embed works well here. Falls back to `media` when omitted. */
  heroMedia?: CaseStudyMedia;
  links?: {
    figma?: string;
    behance?: string;
    live?: string;
  };

  /* ---- project page only; omit any of these and the block is skipped ---- */

  /** Facts panel: Role, Platform, Tools. */
  overview?: readonly { label: string; value: string }[];
  /** The problem, in two or three sentences. Shown before the process. */
  challenge?: string;
  /** What changed as a result. Shown beside the challenge. */
  outcome?: string;
  /** Who the work was for. Rendered as a row of small boxes. */
  personas?: readonly { label: string; title: string; description: string }[];
  /** The numbered design-process spine. */
  process?: readonly ProcessStep[];
  /** Anything that did not fit the narrative. Final screens, explorations. */
  gallery?: readonly CaseStudyMedia[];
  /** Honest closing note. What you'd revisit, what you learned. */
  reflection?: string;
  /** Ownership and attribution note, shown in small print at the very end. */
  disclaimer?: string;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "designing-mfactor-directory",
    title: "The (M) Factor Directory",
    pageTitle: "Designing The (M) Factor Directory",
    summary: "A dedicated platform for discovering menopause care.",
    description:
      "Product design for a dedicated menopause care directory, covering search and filtering, the result cards people scan, the practitioner profiles they land on, and the account flow that carries someone from a first visit to a shortlist worth contacting.",
    role: "Senior UI/UX Designer",
    year: "2025",

    media: {
      kind: "image",
      src: mfactorHero,
      alt: "The (M) Factor homepage hero with symptom and location search fields",
    },
    heroMedia: {
      kind: "embed",
      src: "https://embed.figma.com/proto/Qt5QIEDUt8z7AgCf60iGbK/M-Factor-Platform-1.1?page-id=0%3A1&node-id=1298-11561&m=dev&scaling=scale-down-width&content-scaling=fixed&hide-ui=1&embed-host=share",
      title: "Interactive prototype of The (M) Factor homepage",
      poster: mfactorHero,
      caption:
        "Interactive prototype. Start on the homepage and click through to the other pages.",
    },

    overview: [
      { label: "Type", value: "Client project at Villvay Systems" },
      { label: "Role", value: "Senior UI/UX Designer" },
      { label: "Platform", value: "Responsive web" },
      { label: "Tools", value: "Figma" },
    ],

    challenge:
      "Booking sites exist for almost every kind of care, but none were built around menopause. The design problem was a directory that had to carry far more detail than a general listing, and still stay quick to scan.",
    outcome:
      "Women looking for menopause care now have one place built for it, instead of working through general directories and guessing from a specialty label. Practitioners with the training have somewhere it is the thing being searched for, rather than a line buried in a bio.",

    personas: [
      {
        label: "Finding care",
        title: "Women navigating menopause",
        description:
          "Mostly between 40 and 65, covering perimenopause through to post-menopause. They usually arrive describing symptoms rather than knowing which specialist they need, so search has to accept a symptom, a specialty or a name. Before booking they need to know a practitioner is trained in this, reachable, covered by their insurance and taking patients.",
      },
      {
        label: "Providing care",
        title: "Menopause-trained practitioners",
        description:
          "Doctors, therapists and wellness practitioners alike, from OB/GYNs and endocrinologists through to nutritionists and coaches. They apply to be listed, and verification asks them to evidence a licence alongside confirmed menopause training. Listing here puts that in front of people searching for exactly it, rather than leaving it buried in a bio somewhere general.",
      },
    ],

    process: [
      {
        phase: "Discover",
        title: "Understanding who the platform had to serve",
        body: [
          "The platform came out of the movement around The M Factor, the PBS documentary on menopause. General directories already let you book almost any kind of doctor, but they rank on proximity and availability, so someone looking for menopause care ends up guessing from a name and a specialty label. I worked through the directories people were already using the way a patient would, marking every point where the trail went cold.",
          "The verification standard turned out to be the hinge between the two sides. People will not trust a directory that lists anyone, and practitioners will not bother joining one that fails to tell them apart from anyone. That made the badge and the criteria behind it a structural decision rather than a piece of branding, and it shaped the search, the cards and the profiles that came after.",
        ],
        takeaways: [
          "People arrive with symptoms, not a diagnosis. Search had to accept whatever they can actually name.",
          "The audience skews over 40, so legibility and contrast were constraints from the first sketch rather than a check at the end.",
          "The two sides depend on each other. A thin directory is not worth searching, and an unverified one is not worth joining.",
        ],
      },
      {
        phase: "Define",
        title: "Listing what someone needs to know before they book",
        body: [
          "This turned out to be an information problem before it was a layout problem. I wrote out everything a person needs settled before committing to an appointment. Does this practitioner treat what I have, are they trained in menopause specifically, can I reach them in person or remotely, can we understand each other, will they take my insurance, and are they taking new patients at all.",
          "That list became the spine of the product. Every item had to live somewhere, and deciding where was the actual design work. It becomes a filter if people use it to narrow the field, sits on the result card if it rules someone out at a glance, and waits inside the profile if it only matters once you are seriously considering them. Anything that failed all three tests did not make it in.",
        ],
        takeaways: [
          "Deciding where each fact belongs, filter or card or profile, settled most of the layout questions before I drew anything.",
          "If a detail could not narrow a search, rule someone out, or close a decision, it was not worth the space.",
        ],
      },
      {
        phase: "Ideate",
        title: "Trying structures before drawing screens",
        body: [
          "With the list settled I worked through how discovery should be shaped. Whether to lead with search or let people browse by category, whether one ranked list was enough or geography needed a view of its own, and how much to ask at sign up before it starts to feel like paperwork.",
          "Browse-first went early, since categories only help when you already know what you are looking for and most people here do not. Geography earned its own view, because a practitioner who reads well on paper is no use three states away and a ranked list hides that until you check each address. Sign up settled at three questions, location, preferred language and up to five areas of focus, enough to make a first set of results worth looking at without turning it into a form.",
        ],
        takeaways: [
          "Search first, with the map as a second reading of the same result set rather than a separate mode.",
        ],
      },
      {
        phase: "Design",
        title: "Designing the search, the profile and the system",
        body: [
          "Filtering resolved into five groups, each answering one question from the list. Provider Specialty, Certifications, Service Modality, Languages and Cultural Focus. A single switch above them narrows the directory to verified providers, which turns trust into something you filter by rather than something you notice halfway down the page. Result cards carry only what rules a practitioner in or out, and whether they are accepting new patients gets its own status treatment instead of sitting among the tags.",
          "The profile then follows the same order as the original list. Who they are and whether they are verified, what they treat, then everything that decides whether an appointment can happen at all: languages spoken, licensed state, which states telehealth covers, insurance accepted and how payment works. Credentials and training sit lower down, since they only matter once the rest is settled. All of it runs on a shared token set for colour, type and spacing, with buttons, tags and inputs built as components. With most of the audience over 40, type sizes, colour contrast and tap targets were set for comfortable reading rather than the minimum that passes, checked against WCAG 2.2 AA.",
        ],
        media: [
          {
            kind: "image",
            src: mfactorSearchResults,
            alt: "Search results page with a left filter rail and provider result cards",
            caption:
              "Each filter group answers one item from the list. The verified switch sits above all of them.",
          },
          {
            kind: "image",
            src: mfactorMapView,
            alt: "Map view of provider search results with clustered location pins",
            caption:
              "The same filtered set, read as geography instead of a list.",
          },
          {
            kind: "image",
            src: mfactorProviderProfile,
            alt: "Provider profile page showing services, about, insurance, credentials and a contact sidebar",
            caption:
              "Languages, licence coverage and insurance come before credentials, since those are what decide whether an appointment is possible at all. Contact details and booking stay in view down the right.",
          },
        ],
        takeaways: [
          "Trust reads better as a filter than as a badge you spot later.",
          "Accepting new patients belongs on the card. It is the fastest way to rule someone out.",
          "One token set kept a marketing homepage, a search tool, a profile and a content hub from drifting apart.",
        ],
      },
      {
        phase: "Validate",
        title: "Reviewing, cutting and iterating",
        body: [
          "The whole site went through repeated walkthroughs with stakeholders, and the page that changed most across them was Explore All Providers. It carries the filter model, the result card and both views at once, so every unresolved question about what a search has to answer surfaced there before it surfaced anywhere else.",
          "Each round tightened the same few things. What belongs on a result card, how the filter groups are worded, and how much of a profile to preview before someone commits to opening it.",
        ],
        takeaways: [
          "The page carrying the most logic is the one worth reviewing most often.",
        ],
      },
    ],

    gallery: [
      {
        kind: "image",
        src: mfactorHomepage,
        alt: "Full (M) Factor homepage from hero through statistics, verification section and article feed",
        caption:
          "The full homepage. Search first, then proof, then the verification standard, then a pitch to practitioners.",
      },
      {
        kind: "image",
        src: mfactorResources,
        alt: "Resources hub with featured videos and a filterable grid of insights, guides and news",
        caption:
          "The Resources hub, split into Insights, Guides and News, with author and read time on every card.",
      },
      {
        kind: "image",
        src: mfactorAuthSignIn,
        alt: "Sign in screen with email and password fields and social sign in options",
        caption: "Sign in.",
      },
      {
        kind: "image",
        src: mfactorAuthCreate,
        alt: "Create account screen with social sign up options and a registration form",
        caption: "Create an account.",
      },
      {
        kind: "image",
        src: mfactorAuthVerify,
        alt: "Email verification screen prompting the user to check their inbox",
        caption: "Email verification, with a resend option in reach.",
      },
      {
        kind: "image",
        src: mfactorAuthPersonalize,
        alt: "Personalisation screen asking for location, preferred language and areas of focus",
        caption:
          "The three questions that seed a first set of results: location, language, areas of focus.",
      },
    ],

    reflection:
      "The practitioner side runs on a [Filament](https://filamentphp.com/) dashboard, and its customisation limits turned out to be the biggest constraint on the project. Provider management and the application submission steps had to be assembled from Filament's own components and plugins, so those screens follow what the framework already does rather than what I would have drawn from scratch.",

    disclaimer:
      "All brand names, trademarks and product imagery shown here remain the property of their respective owners and clients. This work was produced during my time at [Villvay Systems](https://villvay.com) and is shown for portfolio purposes only.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
