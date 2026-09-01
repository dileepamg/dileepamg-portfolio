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
import wurthCart from "@/media/wurth-cart.png";
import wurthCategory from "@/media/wurth-category.png";
import wurthDeals from "@/media/wurth-deals.png";
import wurthGuestHome from "@/media/wurth-guest-home.png";
import wurthHero from "@/media/wurth-hero.png";
import wurthHome from "@/media/wurth-home.png";
import wurthProductDetail from "@/media/wurth-product-detail.png";
import wurthSignIn from "@/media/wurth-sign-in.png";
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
      /**
       * Phone screens are framed to a handset ratio and laid out several to
       * a row. Everything else is cropped to 16:9 so rows line up.
       */
      orientation?: "landscape" | "portrait";
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
 * One chapter of a project's story.
 *
 * Chapters are numbered by position and are deliberately not tied to a fixed
 * set of phases. A project gets as many as its story needs, named after what
 * actually happened on it, so two case studies built from this same type can
 * read nothing like each other.
 *
 * Written to be skimmable in layers: the title says what the chapter covers,
 * the lede gives its argument in one line, and the decisions callout holds the
 * conclusions. Someone reading only those three should still follow the work.
 */
export type CaseStudyChapter = {
  /**
   * Anchor for the chapter, used for direct links. Falls back to a slug of
   * the title, so set it where the URL should stay put while the wording is
   * still being worked on.
   */
  id?: string;
  title: string;
  /** The chapter in one line, set above the body. */
  lede?: string;
  /**
   * Sits between the lede and the body, for the handful of things that are
   * genuinely a list. Steps in a sequence read far better numbered than
   * strung through a sentence; use prose for everything else.
   */
  list?: {
    ordered?: boolean;
    items: readonly string[];
  };
  /** One string per paragraph. Two or three short ones beat one long one. */
  body: readonly string[];
  media?: readonly CaseStudyMedia[];
  /**
   * Pulled out into a highlighted callout. Two to four decisions worth
   * scanning on their own. Leave it off where the prose already makes the
   * point: every chapter carrying one turns the page into a stack of
   * identical cards.
   */
  decisions?: readonly string[];
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
  /**
   * Outbound links shown at the foot of the project page.
   *
   * There is deliberately no app store field. Store listings are the client's
   * marketing surface, not evidence of the design work, and they rot. An app
   * gets pulled or rebranded and the case study is left pointing at a dead or
   * misleading page. Keep the links to things that show the work itself.
   */
  links?: {
    figma?: string;
    behance?: string;
    live?: string;
  };

  /* ---- project page only; omit any of these and the block is skipped ---- */

  /** Facts panel: Role, Platform, Tools. */
  overview?: readonly { label: string; value: string }[];
  /** The problem, in two or three sentences. Shown before the chapters. */
  challenge?: string;
  /** What changed as a result. Shown beside the challenge. */
  outcome?: string;
  /**
   * What you personally did, shown under the challenge and outcome. Keep the
   * summary and the list from repeating each other: the summary places the
   * work, the list names its parts.
   */
  scope?: {
    summary: string;
    responsibilities?: readonly string[];
  };
  /** Who the work was for. Rendered as a row of small boxes. */
  personas?: readonly { label: string; title: string; description: string }[];
  /** The numbered chapters. As many as the project needs. */
  chapters?: readonly CaseStudyChapter[];
  /** Anything that did not fit the narrative. Final screens, explorations. */
  gallery?: readonly CaseStudyMedia[];
  /** Honest closing note. What you'd revisit, what you learned. */
  reflection?: string;
  /** Ownership and attribution note, shown in small print at the very end. */
  disclaimer?: string;
};

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "designing-wurth-baer-supply-company-app",
    title: "Würth Baer Supply Company App",
    pageTitle: "Designing the Würth Baer Supply Company App",
    summary:
      "Mobile ordering for a woodworking hardware distributor's 100,000+ product catalog.",
    description:
      "Würth Baer Supply Company distributes woodworking hardware and supplies to cabinet shops, contractors and furniture makers, with a catalog of more than 100,000 products. I designed their iOS and Android app, keeping a catalog that size quick to search and order from a phone.",
    role: "Senior UI/UX Designer",
    year: "2025 – 2026",

    media: {
      kind: "image",
      src: wurthHero,
      alt: "Three Würth Baer Supply Company app screens: the signed in home, a product page and the deals tab",
    },
    heroMedia: {
      kind: "embed",
      // `hide-ui=1` drops Figma's own chrome so the prototype reads as part of
      // the page. `scaling=contain` rather than the M Factor entry's
      // `scale-down-width`: this is a handset prototype, so it is fitted whole
      // inside the frame instead of being stretched to the column's width.
      src: "https://embed.figma.com/proto/kZZEiv760ZbFSPJlqdmU3z/WurthLAC---Mobile-App-1.1?page-id=10166%3A126286&node-id=10166-142284&m=dev&scaling=contain&content-scaling=fixed&hide-ui=1&embed-host=share",
      title: "Interactive prototype of the Würth Baer Supply Company app",
      poster: wurthHero,
      caption:
        "Interactive prototype. Start on the home screen and tap through to search, a product page and the deals tab.",
    },

    overview: [
      { label: "Type", value: "Client project at Villvay Systems" },
      { label: "Role", value: "Senior UI/UX Designer" },
      { label: "Platform", value: "iOS and Android" },
      { label: "Tools", value: "Figma" },
    ],

    challenge:
      "Bring an established desktop storefront to mobile with most of its functionality intact, without losing the details trade buyers rely on: item numbers, pricing units, quantity tiers, and branch stock.",
    outcome:
      "A live iOS and Android app that carries the store's ordering workflow onto a phone, with scanning, contracted pricing, branch stock and account history all a few taps apart.",

    scope: {
      summary:
        "I was the designer on the mobile app, working from the existing storefront through to the built product and staying with it after release.",
      responsibilities: [
        "UX research for the mobile app",
        "Product flows and information architecture",
        "Adapting the storefront experience to mobile",
        "Prototyping and detailed UI",
        "Design system and component work",
        "Accessibility across the ordering flows and shared components",
        "Working with the development team through the build",
        "Implementation review and post-launch refinement",
      ],
    },

    personas: [
      {
        label: "Ordering",
        title: "Trade buyers",
        description:
          "Cabinetmakers, contractors, and furniture shops that usually arrive with a part number or a previous order. Their priorities are quantity pricing, branch stock, and delivery.",
      },
      {
        label: "Browsing",
        title: "Woodworkers buying for themselves",
        description:
          "Hobbyists and small shops that browse by category, compare brands and finishes, and rely less on trade shorthand.",
      },
    ],

    chapters: [
      {
        id: "buying-model",
        title: "Understanding how customers actually buy",
        lede: "The website already did everything the app needed to do, so I treated it as the spec rather than a layout to shrink.",
        body: [
          "Working through the store as a customer showed what a phone could not drop. Buyers identify products by item and manufacturer number, because the catalog is full of names that differ by a word or two.",
          "Prices change with the unit and the quantity tier. Stock only means something at a named branch, and contracted pricing changes the price itself once you sign in.",
          "None of that is an observation about the old site. Each one is a constraint: separate a number from the thing qualifying it and the screen gets easier to read and worse to buy from.",
        ],
        decisions: [
          "Treat the storefront as a source of product requirements, not a layout to shrink.",
          "Carry item and manufacturer numbers through the whole buying journey.",
          "Never show a price without the unit it applies to.",
          "Never show stock without the branch it sits in.",
        ],
      },
      {
        id: "mobile-experience",
        title: "Deciding what belongs on mobile",
        lede: "Everyone opens the app on the same screen, but not everyone arrives with the same thing behind them.",
        body: [
          "An existing account brings shopping lists, past orders and agreed pricing. A first visit brings a catalog thousands of products deep and no way into it.",
          "So home resolves differently. Signed in, account tools sit above the category grid in compact rows. Signed out, categories lead and one prompt names what an account adds. Blocking the catalog behind a sign in wall would have been easier to build and worse to use.",
          "Two things earned a native treatment rather than a port. Buyers usually have the product or its packaging in hand, so barcode scanning sits inside the search bar as a way of searching. Mobile only discounts got their own tab, because a reason to open the app should not be something you scroll past.",
          "Neither came from the website, since neither problem exists on a desktop. The buying workflow had to survive the move. The page structure did not.",
        ],
        media: [
          {
            kind: "image",
            src: wurthHome,
            orientation: "portrait",
            alt: "Signed in home screen with shopping lists, recent orders, purchased items and a featured categories grid",
            caption:
              "Signed in: account tools lead the page, with search and scanning always available.",
          },
          {
            kind: "image",
            src: wurthGuestHome,
            orientation: "portrait",
            alt: "Signed out home screen with a sign in prompt above the featured categories grid, keeping the same search and scan bar in the header",
            caption:
              "Signed out: the catalog leads, and one prompt says what signing in unlocks.",
          },
        ],
        decisions: [
          "Let each account state lead with what it can actually offer.",
          "Make scanning a way of searching, not a secondary feature.",
          "Organise the screen around tasks instead of desktop page sections.",
        ],
      },
      {
        id: "purchase-flow",
        title: "Designing around the buying decision",
        lede: "Desktop can show identifiers, pricing, configuration and stock side by side. On a phone they compete for one column, so I ordered them around the sequence a buyer actually moves through.",
        list: {
          ordered: true,
          items: [
            "Confirm this is the right item.",
            "Work out what it costs per unit, and at what quantity.",
            "Configure the variation.",
            "Check the relevant branch has it.",
            "Add it to the cart.",
          ],
        },
        body: [
          "Configuration keeps both routes the website offers. Someone holding a part number selects it directly, and everyone else builds the item from options, with an explicit “OR select options” divider between the two.",
          "Combinations that do not exist stay on screen struck through. A chip that vanishes looks like a bug, while a disabled one tells you the finish is not made in that size.",
          "Add to Cart is pinned, so the thing the page is for never scrolls away. Specifications, documents and related items sit behind Show More. Nothing the website offered was dropped, it just stopped arriving all at once.",
        ],
        media: [
          {
            kind: "image",
            src: wurthProductDetail,
            orientation: "portrait",
            alt: "Product page showing deal tags, item and manufacturer numbers, multi unit pricing, quantity breaks, option chips, branch stock and a pinned add to cart button",
            caption:
              "Item identity, pricing, configuration, and branch availability in decision order.",
          },
          {
            kind: "image",
            src: wurthCategory,
            orientation: "portrait",
            alt: "Category browse screen with a grid of illustrated subcategory tiles",
            caption:
              "Visual categories make unfamiliar hardware faster to recognize.",
          },
        ],
        decisions: [
          "Support both part led and option led selection.",
          "Disable unavailable combinations rather than hiding them.",
          "Keep secondary detail one tap away instead of in the main flow.",
        ],
      },
      {
        id: "after-launch",
        title: "Refining the product on real devices",
        lede: "The app shipped on iOS and Android, and the design work carried on from there.",
        body: [
          "I went through the built product on physical devices rather than signing off from Figma. A pricing block that looks balanced in an artboard can read as a wall of numbers on a handset held at arm's length.",
          "The product page needed the most work, which was no surprise. It carries more of the product logic than anything else in the app.",
          "Pricing rows were tightened, option controls resized and respaced, and the stock block reworked so the branch and the count read as one thing rather than two competing ones. Other dense screens took smaller adjustments of the same kind.",
          "None of it came from cutting content. The detail a buyer occasionally needs stayed behind Show More, one tap away rather than in the way.",
        ],
      },
    ],

    gallery: [
      {
        kind: "image",
        src: wurthDeals,
        orientation: "portrait",
        alt: "Deals tab with a brand promotion carousel above a list of daily discounts",
        caption:
          "Brand promotions and daily discounts in one focused destination.",
      },
      {
        kind: "image",
        src: wurthCart,
        orientation: "portrait",
        alt: "Cart screen with line items carrying item and manufacturer numbers, per unit pricing, quantity in units and branch stock, above an estimated total and a delivery method row",
        caption:
          "The cart keeps the trade detail on every line: units, item numbers and the branch the stock comes from.",
      },
      {
        kind: "image",
        src: wurthSignIn,
        orientation: "portrait",
        alt: "Sign in screen with email or user ID, password, forgot links and a create account prompt",
        caption:
          "Sign in with email or user ID to support existing trade accounts.",
      },
    ],

    reflection:
      "The hardest decision was what to carry over from the desktop product page. Every field on it serves someone, so I kept what most buyers need to identify, price, configure and source an item, and moved the rest behind Show More. That preserved the catalog's precision without asking the first screen to do all the work at once.",

    disclaimer:
      "All brand names, trademarks and product imagery shown here remain the property of their respective owners and clients. This work was produced during my time at [Villvay Systems](https://villvay.com) and is shown for portfolio purposes only.",
  },
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
      "Create a directory focused on menopause care that communicates deeper provider details without slowing discovery.",
    outcome:
      "A focused platform where people can find verified care and trained practitioners can be discovered for their expertise.",

    scope: {
      summary:
        "I designed the directory and the pages around it, from how someone searches to what a practitioner's profile has to prove, along with the provider side workflows in the admin.",
      responsibilities: [
        "Search, filtering and the discovery model",
        "Result cards and provider profiles",
        "Account creation and onboarding",
        "Design system: shared tokens and components",
        "Accessibility to WCAG 2.2 AA",
        "Provider management workflows in the practitioner dashboard",
        "Stakeholder walkthroughs and design iteration",
      ],
    },

    personas: [
      {
        label: "Finding care",
        title: "Women navigating menopause",
        description:
          "Women from perimenopause through postmenopause who often describe symptoms before knowing which specialist they need. They need clear signals on training, access, insurance, and availability.",
      },
      {
        label: "Providing care",
        title: "Practitioners trained in menopause care",
        description:
          "Licensed clinical and wellness professionals who submit evidence of their credentials and menopause training. They need that expertise to be visible and trusted.",
      },
    ],

    chapters: [
      {
        id: "trust-problem",
        title: "Understanding what makes a provider credible",
        lede: "General healthcare directories make distance, insurance and next available appointment easy to compare. Menopause expertise is not.",
        body: [
          "It usually appears as a line someone wrote about themselves, with nothing behind it. That gap runs both ways: a patient cannot tell trained from interested, and a practitioner who has done the training has no way to be found for it.",
          "Verification closes both, which meant it could not sit on a profile as a badge you notice after already choosing. It had to be in the search controls, on the result cards and in the profile, wherever it can still change who someone contacts.",
          "The audience shaped the interface too. Comfortable reading was a requirement rather than a compliance pass at the end, so type sizes, contrast and how much text sits on a screen were settled early.",
        ],
        decisions: [
          "Let people search by symptom as well as by specialist or name.",
          "Make verification useful inside the decision, not decorative on the profile.",
          "Treat comfortable reading as a requirement, not a final check.",
        ],
      },
      {
        id: "decision-model",
        title: "Deciding what someone needs to know before choosing care",
        lede: "Before any screens, I wrote down the questions someone has to answer before they will contact anybody.",
        list: {
          items: [
            "Does this person treat what I am experiencing?",
            "Are they specifically trained in menopause care?",
            "Can I reach them, in person or remotely?",
            "Do they speak my language?",
            "Do they take my insurance?",
            "Are they accepting patients at all?",
          ],
        },
        body: [
          "That list is the structure of the product. Each question belongs where its answer can still change what happens next, and that place is different for each one.",
          "Insurance and language rule providers out in bulk, so they sit in the filters. Whether someone is accepting patients rules them out too, but only once you are looking at a specific person, so it sits on the card.",
          "Treatment areas, licensed states, telehealth coverage and credentials are what you read after narrowing to a few names, so they sit in the profile.",
          "Getting that wrong in either direction costs something. Too much detail too early turns a result card into a page nobody scans. Too little means opening six profiles to find five are closed to new patients.",
        ],
      },
      {
        id: "discovery",
        title: "Building search around symptoms, trust and access",
        lede: "Browsing by category assumes you already know what you are looking for. Most people arriving here can describe what is happening to them, not name the practitioner who handles it.",
        body: [
          "So the homepage leads with search and takes symptoms as a starting point. From there the filters narrow: specialty, certification, service modality, language and cultural focus, with Verified Providers above the groups as a primary control rather than inside one. That makes trust something you search on.",
          "Distance behaves differently, because it rules a provider out for reasons that have nothing to do with their expertise. The map is a second view of the same filtered set rather than a separate mode with its own results, so switching views never changes who you are looking at.",
          "Cards carry what decides whether a name is worth opening, including whether the provider is accepting new patients. Profiles go deeper: treatment areas, languages, licensed states, telehealth coverage, insurance, payment and credentials.",
          "Onboarding asks three things: location, preferred language and up to five areas of focus. It could have asked for much more and produced better first results, but a directory that opens with a medical questionnaire loses the person before it helps them.",
        ],
        media: [
          {
            kind: "image",
            src: mfactorSearchResults,
            alt: "Search results page with a left filter rail and provider result cards",
            caption: "Focused filters with verification as a primary control.",
          },
          {
            kind: "image",
            src: mfactorMapView,
            alt: "Map view of provider search results with clustered location pins",
            caption: "The same results viewed by location.",
          },
          {
            kind: "image",
            src: mfactorProviderProfile,
            alt: "Provider profile page showing services, about, insurance, credentials and a contact sidebar",
            caption:
              "Access and coverage details lead; contact and booking stay visible.",
          },
        ],
        decisions: [
          "Keep the list and the map as two views of one result set.",
          "Make verification filterable rather than decorative.",
          "Show availability on the card, before the profile.",
          "Keep onboarding personalisation deliberately light.",
        ],
      },
      {
        id: "critical-flow",
        title: "Testing the part of the product carrying the most logic",
        lede: "Explore All Providers is where the whole product meets: the filters, the result cards, the hierarchy inside them, the list and map views, and every route into a profile.",
        body: [
          "Walking through it with stakeholders surfaced problems that a page with a single job never would, so it took repeated rounds while simpler pages took one.",
          "Each round moved the same few things. Filter labels were rewritten where a term meant one thing to a clinician and another to a patient. Card hierarchy shifted as it became clearer which line people read first.",
          "Preview information went up and down until a card said enough to rule a provider in or out without turning into a profile in miniature. That settled what the profile itself had to hold.",
          "Spreading that attention evenly across the product would have wasted most of it. Pages with one job were settled in a pass. This was the flow where being wrong cost something.",
        ],
      },
    ],

    gallery: [
      {
        kind: "image",
        src: mfactorHomepage,
        alt: "Full (M) Factor homepage from hero through statistics, verification section and article feed",
        caption:
          "Search first, followed by trust signals and practitioner acquisition.",
      },
      {
        kind: "image",
        src: mfactorResources,
        alt: "Resources hub with featured videos and a filterable grid of insights, guides and news",
        caption: "A filterable hub for insights, guides, and news.",
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
      "The practitioner dashboard is built on [Filament](https://filamentphp.com/), which sets real limits on how provider management and application review can be arranged. I designed those workflows from the components and plugins the framework already ships rather than drawing an ideal admin that would have needed custom development to exist and maintenance to survive.",

    disclaimer:
      "All brand names, trademarks and product imagery shown here remain the property of their respective owners and clients. This work was produced during my time at [Villvay Systems](https://villvay.com) and is shown for portfolio purposes only.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
