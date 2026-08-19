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

    process: [
      {
        phase: "Discover",
        title: "Auditing the store the app had to carry",
        body: [
          "The website already did everything: the full catalog, contracted pricing, shopping lists, order history and branch availability. It was effectively the specification, so I worked through it as a customer and noted which parts a phone had to keep intact and which only worked because a desktop has room to spare.",
          "Three findings shaped everything after it. Buyers search by item or manufacturer number rather than by name, because the catalog carries products with long, similar names. Prices change by unit and by quantity tier. Availability only means something once it is tied to a branch and a stock count.",
        ],
        takeaways: [
          "Treat the existing site as the specification, not as a layout to copy.",
          "Identify products by number wherever they appear, because the names repeat.",
          "Never show a price without its unit, or stock without its branch.",
        ],
      },
      {
        phase: "Define",
        title: "Deciding what home leads with",
        body: [
          "Everyone opens the app on the same screen, but not everyone arrives for the same thing. Someone with an account already has history and agreed prices to work from. A first time visitor has a catalog thousands of products deep and no way into it yet. Home resolves differently depending on which of those is true.",
          "Signed in, the account has plenty to offer straight away, so shopping lists, recent orders and purchased items sit above the category grid, with contracted pricing carried through the catalog and support reachable from the same screen. Compact rows keep all of it in view without pushing browsing out of reach. Signed out there is no history to show, so categories take the top of the page and one prompt names what an account adds: your pricing, past purchases and order status.",
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
        takeaways: [
          "Let each state lead with what it can actually offer.",
          "Keep account tools compact so they do not crowd out browsing.",
          "Ask for sign-in by naming what it unlocks, not by blocking the catalog.",
        ],
      },
      {
        phase: "Ideate",
        title: "Rebuilding the page structure for one screen",
        body: [
          "On the website a product sits on one wide page with everything visible at once. A phone cannot do that, so rather than shrink the layout I sorted the same information by the decision it supports. Search identifies an item, list cards let you compare, the product page resolves the purchase, and Add to Cart stays pinned because it is what the rest leads to.",
          "Two things earned a native treatment rather than a direct port. Buyers usually have the product or its packaging in hand, so barcode scanning sits inside search instead of behind a menu. Mobile only discounts got their own tab, because a reason to open the app should not be buried on the home screen.",
        ],
        takeaways: [
          "Sort information by decision instead of shrinking the desktop layout.",
          "Treat scanning as a core search method, not an extra.",
        ],
      },
      {
        phase: "Design",
        title: "Sequencing a dense product page",
        body: [
          "The desktop product page shows identifiers, pricing, configuration and availability side by side. On a phone they have to be sequenced, so I ordered them the way the decision is actually made: confirm the item and its numbers, review unit and quantity tier pricing, configure the variant, check named branch availability and backorders, then add to cart.",
          "Configuration keeps both routes the website offers. Buyers who know the part number can select it directly, and everyone else can build the item from options, with an explicit “OR select options” divider between the two. Struck through combinations explain what is unavailable without hiding valid ones.",
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
        takeaways: [
          "Support both part led and option led selection.",
          "Disable invalid combinations instead of hiding them.",
          "Progressively disclose secondary details.",
        ],
      },
      {
        phase: "Validate",
        title: "Refining it on real devices",
        body: [
          "After launch on iOS and Android I reviewed the app on real hardware rather than trusting Figma alone. The product page needed the most iteration, because pricing, options, stock and purchasing actions all compete for the same narrow column.",
          "I tightened the pricing rows, the option controls and the stock block until the page stayed precise without feeling crowded. Secondary detail stayed reachable behind Show More rather than being cut, so nothing the website offered went missing.",
        ],
        takeaways: ["Revisit the most complex screen after launch."],
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

    process: [
      {
        phase: "Discover",
        title: "Mapping trust on both sides",
        body: [
          "The platform grew from the movement around The M Factor documentary. I audited general healthcare directories as a patient and found that proximity and availability were easy to compare, but menopause expertise was often reduced to an unverified line in a bio.",
          "Verification became the link between both audiences. People needed confidence in the listings, while qualified practitioners needed their training to stand out. That decision shaped the search controls, result cards, and provider profiles.",
        ],
        takeaways: [
          "Support symptoms, specialties, and names in search.",
          "Design for comfortable reading, not minimum compliance.",
          "Make verification meaningful to patients and practitioners.",
        ],
      },
      {
        phase: "Define",
        title: "Defining the booking decision",
        body: [
          "Before designing screens, I mapped the questions someone needs answered: Does this provider treat my symptoms? Do they have specific training in menopause care? Can I access them in person or remotely? Do they speak my language, accept my insurance, and take new patients?",
          "I then placed each detail at the point where it changes a decision. Filters narrow the field, result cards surface reasons to include or exclude a provider, and profiles hold the detail needed before making contact.",
        ],
        takeaways: [
          "Match information depth to decision stage.",
          "Remove details that do not narrow or close a decision.",
        ],
      },
      {
        phase: "Ideate",
        title: "Shaping the discovery model",
        body: [
          "I compared leading with search against browsing by category. Search won because many people arrive with symptoms, not a diagnosis or specialist type. The map became a second view of the same filtered results because distance can rule out an otherwise suitable provider.",
          "For account creation, I limited personalization to location, preferred language, and up to five areas of focus. That was enough to improve the first results without turning onboarding into medical paperwork.",
        ],
        takeaways: ["Use list and map as two views of one result set."],
      },
      {
        phase: "Design",
        title: "Designing for confident choices",
        body: [
          "The filter model covers specialty, certification, service modality, language, and cultural focus. I placed Verified Providers above the groups as a primary control, turning trust into a deliberate search choice rather than a badge noticed later.",
          "Cards show the facts most important to a decision, including whether a provider accepts new patients. Profiles then add treatment areas, languages, licensed states, telehealth coverage, insurance, payment, and credentials in priority order. Shared tokens and components keep the directory, content hub, and marketing pages consistent and meet WCAG 2.2 AA.",
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
        takeaways: [
          "Make trust filterable.",
          "Show availability on result cards.",
          "Use one system across discovery and content.",
        ],
      },
      {
        phase: "Validate",
        title: "Testing the most complex flow",
        body: [
          "Stakeholder walkthroughs focused on Explore All Providers because it brings the filter model, result cards, and list and map views together. It exposed issues with the information hierarchy earlier than simpler pages.",
          "Each round refined the filter language, what a card must reveal at a glance, and how much profile detail to preview before asking someone to open it.",
        ],
        takeaways: [
          "Review the flow carrying the most product logic most often.",
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
      "The practitioner dashboard uses [Filament](https://filamentphp.com/), which constrained how provider management and applications could be customized. I worked within its components and plugins rather than designing screens the framework could not support, keeping the workflow practical to build and maintain.",

    disclaimer:
      "All brand names, trademarks and product imagery shown here remain the property of their respective owners and clients. This work was produced during my time at [Villvay Systems](https://villvay.com) and is shown for portfolio purposes only.",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
