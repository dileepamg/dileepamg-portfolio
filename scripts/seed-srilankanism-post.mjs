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

const block = (key, style, text) => ({
  _key: key,
  _type: "block",
  style,
  markDefs: [],
  children: [
    {
      _key: `${key}-span`,
      _type: "span",
      marks: [],
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

let featuredImageAssetId = await uploadRemoteImage(
  "https://srilankanism.com/opengraph-image?deabcfa97a93b544",
  "srilankanism-cover.png",
  "cover from opengraph-image",
);

if (!featuredImageAssetId) {
  featuredImageAssetId = await client.fetch(
    `*[_type == "sanity.imageAsset"][0]._id`,
  );
  console.log("Fell back to an existing Sanity image asset.");
}

if (!featuredImageAssetId) {
  throw new Error("No image asset available for the featured image.");
}

const screenshotDir = path.join(process.cwd(), "tmp", "srilankanism");
const screenshotSpecs = [
  {
    file: "home-desktop.png",
    key: "shot-home",
    alt: "SriLankanism homepage with search, trending slang, and Word of the Day",
    caption:
      "Homepage: search, trending terms, and a feed of slang and meme entries",
  },
  {
    file: "directory-desktop.png",
    key: "shot-directory",
    alt: "SriLankanism directory cards for words and memes with voting",
    caption: "Word and meme cards with definitions, attributions, and votes",
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

const oldPostId = "post.the-story-behind-srilankanism";
const postId = "post.preserving-sri-lankan-slang";

try {
  await client.delete(oldPostId);
  console.log(`Deleted old post: ${oldPostId}`);
} catch (error) {
  console.log(`Old post cleanup: ${error.message}`);
}

await client.createOrReplace({
  _id: postId,
  _type: "post",
  title: "Building a Know Your Meme and Urban Dictionary for Sri Lanka",
  slug: {
    _type: "slug",
    current: "building-a-know-your-meme-and-urban-dictionary-for-sri-lanka",
  },
  excerpt:
    "A community directory of Sri Lankan slang and memes, with origins, definitions, and how they are actually used.",
  featuredImage: {
    _type: "image",
    asset: { _type: "reference", _ref: featuredImageAssetId },
    alt: "SriLankanism, a directory of Sri Lankan slang and memes",
  },
  body: [
    block(
      "intro-1",
      "normal",
      "Sri Lankan slang lives everywhere and nowhere at once. It shows up in WhatsApp groups, TikTok comments, cricket interviews, office banter, and late night phone calls. Meanings shift with tone. Spellings bounce between English and Sinhala. Older references fade before anyone thinks to write them down.",
    ),
    block(
      "intro-2",
      "normal",
      "That is the gap SriLankanism was built to fill: a proper collection of the slang, memes, and cultural shorthand that standard dictionaries leave out, explained in plain language for anyone who wants to understand them.",
    ),
    block("concept-heading", "h2", "The Concept"),
    block(
      "concept-1",
      "normal",
      "SriLankanism is a community built library of Sri Lankan slang and meme culture. The entries cover Sinhala slang, the everyday mix of Sinhala and English, memes tied to specific moments, and the phrases that only make sense if you grew up around them.",
    ),
    block(
      "concept-2",
      "normal",
      "The purpose is straightforward. Give each entry an origin where we can find one, a clear definition, real examples, and notes on correct usage. At the same time, treat the site as a living archive. Urban culture keeps moving, and if nobody records it, the jokes and the vocabulary vanish with the feed.",
    ),
    block("inspiration-heading", "h2", "The Inspiration"),
    block(
      "inspiration-1",
      "normal",
      "The idea leans heavily on Urban Dictionary and Know Your Meme. Those sites already do this work on a global scale: crowd sourced definitions, context, and the story behind how something spread.",
    ),
    block(
      "inspiration-2",
      "normal",
      "What they do not cover well is the localized, often unspoken layer of Sri Lankan speech and internet culture. Search for machan, aathal, baila gahanawa, or a cricket press conference meme and you will mostly find fragments, not a careful explanation. SriLankanism exists to close that gap without flattening the humor or the nuance.",
    ),
    block("built-heading", "h2", "What We Built"),
    block(
      "built-team",
      "normal",
      "I built SriLankanism with two other friends. Together, we shaped it into a community directory that makes Sri Lankan slang and meme culture easier to find, understand, and preserve.",
    ),
    block(
      "built-1",
      "normal",
      "The live site splits the archive into two paths: a Sinhala Urban Dictionary for words and phrases, and a Memes section for viral moments and catchphrases. Both live under one search, so you can look across slang and memes without bouncing between tools.",
    ),
    block(
      "built-2",
      "normal",
      "Each word entry aims for the same shape: English and Sinhala spellings where they apply, a definition that starts from how people actually use the phrase, and notes that catch the traps. Shape does not mean geometry here. Talk karanawa is not just talking. Baila gahanawa is not about the music genre. Tone can turn ado from a friendly hey into something much sharper.",
    ),
    block(
      "built-3",
      "normal",
      "Meme entries go further. They explain where a clip or quote came from, what it means, and how it traveled. That includes things like interview lines that escaped into the timeline, cricket press conference moments, and songs that got remixed into local meme lore.",
    ),
    ...screenshotBlocks,
    block(
      "built-4",
      "normal",
      "Around the directory we added the pieces that make a community archive usable day to day: trending terms on the homepage, a Word of the Day with a sample conversation, voting on entries, an NSFW toggle for filtering, and an Add New flow for submissions.",
    ),
    block("community-heading", "h2", "Built With the Community"),
    block(
      "community-1",
      "normal",
      "Anyone can search, read, vote, and submit without needing an account first. New words and memes go into a review queue and only appear after an admin approves them. That keeps the directory open without turning it into an unmoderated dump of guesses.",
    ),
    block(
      "community-2",
      "normal",
      "The site is only as good as the people who fill it. If a phrase is missing, the invitation is simple: add the word or meme, and write it the way you would explain it to a friend who just asked what it means.",
    ),
    block("why-heading", "h2", "Why It Matters"),
    block(
      "why-1",
      "normal",
      "Language like this is cultural infrastructure. It carries humor, belonging, and history that never make it into textbooks. Documenting it is not about freezing slang in place. It is about giving future readers, diaspora kids, curious visitors, and ourselves a place to look when the chat scrolls past and the joke needs context.",
    ),
    block(
      "why-2",
      "normal",
      "SriLankanism is still growing. The directory will keep changing as people submit, vote, correct, and argue about the right definition. That is the point. The culture is alive, so the archive has to stay alive with it.",
    ),
    linkedParagraph(
      "outro-link",
      "Explore the live site at ",
      "srilankanism.com",
      "https://srilankanism.com/",
      ".",
    ),
  ],
  // Keep this behind Sanity's publishedAt <= now() filter on every environment.
  publishedAt: "2026-08-20T09:00:00.000Z",
  categories: [
    {
      _key: "community-cat",
      _type: "reference",
      _ref: "category.community",
    },
  ],
  tags: ["SriLankanism", "Community", "Sri Lanka", "Culture"],
  featured: true,
  seo: {
    _type: "seo",
    title: "Building a Know Your Meme and Urban Dictionary for Sri Lanka",
    description:
      "A community directory of Sri Lankan slang and memes, with origins, definitions, and how they are actually used.",
    noIndex: false,
  },
});

console.log(`Seeded blog post: ${postId}`);
console.log(
  JSON.stringify(
    await client.fetch(
      `*[_type == "post"]{_id, title, "slug": slug.current} | order(publishedAt desc)`,
    ),
    null,
    2,
  ),
);
