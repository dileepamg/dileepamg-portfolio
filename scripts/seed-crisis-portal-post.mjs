import { createClient } from "@sanity/client";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

process.loadEnvFile?.(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or dataset.");
}

if (!token) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN. Add a temporary Editor token to seed posts.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-24",
  useCdn: false,
});

const block = (key, style, text, marks = [], markDefs = []) => ({
  _key: key,
  _type: "block",
  style,
  markDefs,
  children: [
    {
      _key: `${key}-span`,
      _type: "span",
      marks,
      text,
    },
  ],
});

const linkedParagraph = (key, before, linkText, href, after = "") => {
  const linkKey = `${key}-link`;
  return {
    _key: key,
    _type: "block",
    style: "normal",
    markDefs: [
      {
        _key: linkKey,
        _type: "link",
        href,
        blank: true,
      },
    ],
    children: [
      {
        _key: `${key}-before`,
        _type: "span",
        marks: [],
        text: before,
      },
      {
        _key: `${key}-anchor`,
        _type: "span",
        marks: [linkKey],
        text: linkText,
      },
      {
        _key: `${key}-after`,
        _type: "span",
        marks: [],
        text: after,
      },
    ],
  };
};

async function uploadImage(filePath, filename, label) {
  if (!existsSync(filePath)) return null;
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename,
  });
  console.log(`Uploaded ${label}: ${asset._id}`);
  return asset._id;
}

async function uploadRemoteImage(url, filename, label) {
  const response = await fetch(url);
  if (!response.ok) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  const tmpDir = path.join(process.cwd(), ".tmp");
  mkdirSync(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, filename);
  writeFileSync(tmpFile, buffer);
  return uploadImage(tmpFile, filename, label);
}

const samplePostIds = [
  "post.sample-designing-for-clarity",
  "post.sample-motion-as-interface-feedback",
];

const existing = await client.fetch(`*[_type == "post"]{_id, title}`);
console.log("Existing posts:", existing);

for (const id of samplePostIds) {
  try {
    await client.patch(id).unset(["relatedPosts"]).commit();
  } catch {
    // Document may already be gone.
  }
}

const deleteTransaction = client.transaction();
for (const id of samplePostIds) {
  deleteTransaction.delete(id);
}
try {
  await deleteTransaction.commit();
  console.log(`Deleted sample posts: ${samplePostIds.join(", ")}`);
} catch (error) {
  console.log(`Sample post cleanup: ${error.message}`);
}

let featuredImageAssetId;

const localCoverCandidates = [
  path.join(process.cwd(), "media", "crisis-portal-cover.jpg"),
  path.join(process.cwd(), "media", "crisis-portal-cover.png"),
  path.join(process.cwd(), "public", "crisis-portal-cover.jpg"),
];

for (const file of localCoverCandidates) {
  featuredImageAssetId = await uploadImage(
    file,
    path.basename(file),
    `cover from ${file}`,
  );
  if (featuredImageAssetId) break;
}

if (!featuredImageAssetId) {
  const articleUrl =
    "https://elements.lk/2026/01/29/the-story-behind-crisis-portal/";
  const html = await fetch(articleUrl).then((response) => response.text());
  const ogMatch =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    );

  if (ogMatch?.[1]) {
    featuredImageAssetId = await uploadRemoteImage(
      ogMatch[1],
      "crisis-portal-cover.jpg",
      `cover from ${ogMatch[1]}`,
    );
  }
}

if (!featuredImageAssetId) {
  featuredImageAssetId = await client.fetch(
    `*[_type == "sanity.imageAsset"][0]._id`,
  );
  console.log("Fell back to an existing Sanity image asset.");
}

if (!featuredImageAssetId) {
  throw new Error("No image asset available for the featured image.");
}

const screenshotDir = path.join(process.cwd(), "tmp", "crisis-portal");
const screenshotSpecs = [
  {
    file: "home-desktop.png",
    key: "shot-home",
    alt: "Crisis Portal homepage showing the hero carousel and resource directory",
    caption: "Crisis Portal homepage — curated flood-relief resources in one place",
  },
  {
    file: "resources-desktop.png",
    key: "shot-resources",
    alt: "Crisis Portal resource cards including Flood Support, Bring Them Home, and donation links",
    caption: "Resource cards with community and government badges",
  },
];

const screenshotBlocks = [];
for (const shot of screenshotSpecs) {
  const assetId = await uploadImage(
    path.join(screenshotDir, shot.file),
    shot.file,
    shot.file,
  );
  if (!assetId) {
    console.warn(`Skipping missing screenshot: ${shot.file}`);
    continue;
  }
  screenshotBlocks.push({
    _key: shot.key,
    _type: "imageWithAlt",
    asset: { _type: "reference", _ref: assetId },
    alt: shot.alt,
    caption: shot.caption,
  });
}

await client.createOrReplace({
  _id: "category.community",
  _type: "category",
  title: "Community",
  slug: { _type: "slug", current: "community" },
  description: "Projects and stories from community work and collaboration.",
});

const postId = "post.the-story-behind-crisis-portal";

await client.createOrReplace({
  _id: postId,
  _type: "post",
  title: "The Story Behind Crisis Portal",
  slug: {
    _type: "slug",
    current: "the-story-behind-crisis-portal",
  },
  excerpt:
    "How three of us helped pull scattered flood-relief resources into one place after Cyclonic Storm Ditwah.",
  featuredImage: {
    _type: "image",
    asset: { _type: "reference", _ref: featuredImageAssetId },
    alt: "Crisis Portal, a directory of flood relief resources for Sri Lanka",
  },
  body: [
    block("intro-kicker", "normal", "Centralizing Aid When It Matters Most"),
    block(
      "intro-1",
      "normal",
      "When Cyclonic Storm Ditwah made landfall in Sri Lanka on 28 November 2025, it left behind one of the most devastating humanitarian crises in recent years. Over 1.4 million people were affected across all 25 districts. In the days that followed, something remarkable happened: Sri Lankans stepped up for each other.",
    ),
    block(
      "intro-2",
      "normal",
      "Developers, volunteers, designers, animal rescuers, students, and people from every corner of the country came together to build tools and platforms overnight. We saw community driven solutions for flood support, animal rescue, missing person finders, donation coordination, educational resources, and even an official government backed website to help rebuild the nation. It was a powerful reminder of how deeply rooted compassion is within our country.",
    ),
    block(
      "intro-3",
      "normal",
      "But amid all the goodwill, we noticed a critical issue.",
    ),
    block("problem-heading", "h2", "The Problem We Saw"),
    block(
      "problem-1",
      "normal",
      "All these resources, though impactful, were scattered everywhere. Facebook groups. Instagram stories. WhatsApp chats. Google Sheets. Standalone websites. If you were someone in need or someone trying to help, finding the right information meant jumping across a dozen platforms. In a crisis, every second counts, and that complexity was costing valuable time.",
    ),
    block(
      "problem-2",
      "normal",
      "To our team, this gap became very personal. One of our team members had to report a missing person during the storm, and the only reliable information they found was through our own internal chat. It made us ask ourselves: what if we could bring all these life saving resources into one place?",
    ),
    block(
      "problem-3",
      "normal",
      "And that became the foundation of Crisis Portal.",
    ),
    block("build-heading", "h2", "Building a Centralized Hub for Help"),
    block(
      "build-1",
      "normal",
      "I built Crisis Portal with two other friends. We shared one mission: to centralize verified, community driven, and government supported resources into one accessible platform.",
    ),
    block(
      "build-2",
      "normal",
      "We started by manually researching and compiling every trustworthy source we could find. As the project grew, something extraordinary happened: the community began contributing too. People submitted links, tools, and updates they discovered. Every submission was manually reviewed for accuracy and credibility because maintaining the integrity of the platform is, and will always be, our responsibility.",
    ),
    block(
      "build-3",
      "normal",
      "Today, Crisis Portal stands as a curated, easy to navigate directory of essential resources from missing-person support to animal rescue, food distribution, and more.",
    ),
    ...screenshotBlocks,
    block(
      "build-4",
      "normal",
      "All the platforms listed on Crisis Portal were created by incredible individuals and teams across the country. We did not build them. We simply brought them together. The real heroes are the developers, volunteers, and everyday Sri Lankans who stepped up for their communities.",
    ),
    block("timeline-heading", "h2", "How It Unfolded: A Timeline"),
    {
      _key: "timeline-main",
      _type: "timeline",
      items: [
        {
          _key: "tl-1",
          date: "November 30",
          body: "After days of silence and power outages, our team finally reconnected. During our first call post storm, we shared experiences, checked on each other, and immediately recognized the problem: resources were everywhere, and people were struggling to find help.",
        },
        {
          _key: "tl-2",
          date: "December 1",
          body: "We jumped into an initial brainstorm. There was no detailed plan, just urgency. We agreed that even without a name or brand, pushing the first version out quickly could help someone. The first lines of code were written that same day.",
        },
        {
          _key: "tl-3",
          date: "December 2",
          body: "After exploring multiple options, we finalized the name Crisis Portal and secured the domain.",
        },
        {
          _key: "tl-4",
          date: "December 1 to 3",
          body: "Development continued rapidly. We validated resources, refined the UI/UX, and ensured the platform was simple enough for anyone to use, even during a stressful situation.",
        },
        {
          _key: "tl-5",
          date: "December 3",
          body: "Crisis Portal was released to the public.",
        },
        {
          _key: "tl-6",
          date: "December 3 to 6",
          body: "We focused on spreading awareness. Developers, tech leaders, and humanitarian groups reached out with improvements, feedback, and new resources. We updated the platform continuously, sometimes every few hours.",
        },
        {
          _key: "tl-7",
          date: "Ongoing",
          body: "To this day, we remain committed to maintaining the platform, reviewing submissions, verifying resources, improving accessibility, and exploring new ways to scale it so more people can reach the help they need.",
        },
      ],
    },
    block("why-heading", "h2", "Why We Built This"),
    block(
      "why-1",
      "normal",
      "As tech enthusiasts and problem solvers, we believe it is our responsibility to give back to the community. Crisis Portal was born from that belief, a small contribution to a country that always stands together in times of need.",
    ),
    block(
      "why-2",
      "normal",
      "Updates and progress on this project will continue to be shared here.",
    ),
    linkedParagraph(
      "outro-link",
      "Visit the live site at ",
      "crisisportal.org",
      "https://crisisportal.org/en",
      ".",
    ),
  ],
  publishedAt: "2026-01-29T09:00:00.000Z",
  categories: [
    {
      _key: "community-cat",
      _type: "reference",
      _ref: "category.community",
    },
  ],
  tags: ["Crisis Portal", "Community", "Sri Lanka", "Elements"],
  featured: true,
  seo: {
    _type: "seo",
    title: "The Story Behind Crisis Portal",
    description:
      "How three of us helped pull scattered flood-relief resources into one place after Cyclonic Storm Ditwah.",
    noIndex: false,
  },
});

console.log(`Seeded blog post: ${postId}`);
console.log(
  JSON.stringify(
    await client.fetch(`*[_type == "post"]{_id, title, "slug": slug.current}`),
    null,
    2,
  ),
);
