import { defineArrayMember, defineField, defineType } from "sanity";

export const imageWithAltType = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe the image for screen readers and search engines.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
  ],
});

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "image",
      title: "Social sharing image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const linkType = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "external",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});

export const calloutType = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      type: "string",
      options: {
        list: [
          { title: "Note", value: "note" },
          { title: "Tip", value: "tip" },
          { title: "Warning", value: "warning" },
        ],
        layout: "radio",
      },
      initialValue: "note",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const codeBlockType = defineType({
  name: "codeBlock",
  title: "Code block",
  type: "object",
  fields: [
    defineField({ name: "filename", type: "string" }),
    defineField({
      name: "language",
      type: "string",
      initialValue: "text",
    }),
    defineField({
      name: "code",
      type: "text",
      rows: 12,
      validation: (Rule) => Rule.required(),
    }),
  ],
});

export const timelineType = defineType({
  name: "timeline",
  title: "Timeline",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "date",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              type: "string",
            }),
            defineField({
              name: "body",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "date", subtitle: "title" },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: "Timeline",
      subtitle: `${items?.length ?? 0} steps`,
    }),
  },
});

export const blockContentType = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              }),
              defineField({
                name: "blank",
                title: "Open in a new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
    defineArrayMember({ type: "callout" }),
    defineArrayMember({ type: "codeBlock" }),
    defineArrayMember({ type: "timeline" }),
  ],
});

export const caseStudyMediaType = defineType({
  name: "caseStudyMedia",
  title: "Case study media",
  type: "object",
  fields: [
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Embed", value: "embed" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.kind !== "image",
    }),
    defineField({
      name: "orientation",
      type: "string",
      options: {
        list: [
          { title: "Landscape", value: "landscape" },
          { title: "Portrait", value: "portrait" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) => parent?.kind !== "image",
      initialValue: "landscape",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url",
      hidden: ({ parent }) => parent?.kind !== "embed",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "embedTitle",
      title: "Accessible embed title",
      type: "string",
      hidden: ({ parent }) => parent?.kind !== "embed",
    }),
    defineField({
      name: "poster",
      type: "imageWithAlt",
      hidden: ({ parent }) => parent?.kind !== "embed",
    }),
    defineField({
      name: "aspect",
      title: "CSS aspect ratio",
      type: "string",
      description: 'For example, "4 / 3". Defaults to 16 / 9.',
      hidden: ({ parent }) => parent?.kind !== "embed",
    }),
    defineField({
      name: "caption",
      type: "string",
    }),
  ],
  preview: {
    select: {
      kind: "kind",
      image: "image",
      imageAlt: "image.alt",
      embedTitle: "embedTitle",
    },
    prepare: ({ kind, image, imageAlt, embedTitle }) => ({
      title: kind === "embed" ? embedTitle || "Embed" : imageAlt || "Image",
      subtitle: kind === "embed" ? "Embedded media" : "Image",
      media: image,
    }),
  },
});

export const seoAndContentObjectTypes = [
  imageWithAltType,
  seoType,
  linkType,
  calloutType,
  codeBlockType,
  timelineType,
  blockContentType,
  caseStudyMediaType,
];
