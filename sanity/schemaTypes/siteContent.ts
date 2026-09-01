import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "navigation", title: "Navigation" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brandLabel",
      title: "Navigation wordmark",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "canonicalUrl",
      type: "url",
      group: "identity",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["https"], allowRelative: false }),
    }),
    defineField({
      name: "author",
      type: "object",
      group: "identity",
      fields: [
        defineField({
          name: "fullName",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "displayName",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "givenName",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "familyName",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "jobTitle",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "bio",
          type: "text",
          rows: 6,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "profileImage",
          type: "imageWithAlt",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      type: "email",
      group: "contact",
    }),
    defineField({
      name: "resume",
      type: "file",
      group: "contact",
      options: { accept: "application/pdf" },
      fields: [
        defineField({
          name: "downloadName",
          type: "string",
          initialValue: "Dileepa-Galmangoda-Resume.pdf",
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "navigation",
      type: "array",
      group: "navigation",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "footer",
      type: "object",
      group: "footer",
      fields: [
        defineField({ name: "copyrightName", type: "string" }),
        defineField({ name: "sourceLabel", type: "string" }),
        defineField({ name: "sourceUrl", type: "url" }),
        defineField({
          name: "inspirationLinks",
          type: "array",
          of: [defineArrayMember({ type: "link" })],
        }),
      ],
    }),
    defineField({
      name: "defaultSeo",
      type: "seo",
      group: "seo",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "twitterCreator",
      type: "string",
      group: "seo",
      description: "Include the leading @.",
    }),
  ],
  preview: {
    select: { title: "siteName", subtitle: "canonicalUrl" },
  },
});

export const homePageType = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "greetingLatin",
      type: "string",
      initialValue: "Ayubowan",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "greetingSinhala",
      type: "string",
      initialValue: "ආයුබෝවන්",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "availabilityText",
      type: "string",
    }),
    defineField({
      name: "workHeading",
      type: "string",
      initialValue: "Featured Work",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "experienceHeading",
      type: "string",
      initialValue: "Professional Experience",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blogHeading",
      type: "string",
      initialValue: "Blog",
    }),
    defineField({
      name: "blogDescription",
      type: "string",
      initialValue:
        "Stories from things I build in my spare time with friends.",
    }),
    defineField({
      name: "motionHeading",
      type: "string",
      initialValue: "Some Fun Motion Stuff",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "motionDescription",
      type: "string",
    }),
    defineField({
      name: "seo",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
});

export const externalProjectType = defineType({
  name: "externalProject",
  title: "External project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

export const experienceType = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companyUrl",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "dateLabel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logoLight",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logoDark",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "responsibilities",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "skills",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: { title: "role", subtitle: "company", media: "logoLight" },
  },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

export const motionItemType = defineType({
  name: "motionItem",
  title: "Motion item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "muxPlaybackId",
      title: "Mux playback ID",
      type: "string",
      description: "The existing next-video/Mux playback identifier.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      type: "imageWithAlt",
    }),
    defineField({
      name: "order",
      type: "number",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

export const categoryType = defineType({
  name: "category",
  title: "Blog category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
  ],
});

export const siteContentDocumentTypes = [
  siteSettingsType,
  homePageType,
  externalProjectType,
  experienceType,
  motionItemType,
  categoryType,
];
