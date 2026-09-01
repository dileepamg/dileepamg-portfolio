import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudyType = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "card", title: "Card", default: true },
    { name: "story", title: "Story" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "card",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageTitle",
      type: "string",
      group: "card",
      description: "Falls back to the short title when empty.",
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "card",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "previousSlugs",
      type: "array",
      group: "seo",
      description: "Old URL segments that should redirect to the current slug.",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "summary",
      type: "text",
      rows: 3,
      group: "card",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 5,
      group: "card",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "card",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({ name: "role", type: "string", group: "card" }),
    defineField({ name: "year", type: "string", group: "card" }),
    defineField({
      name: "cardMedia",
      title: "Card media",
      type: "caseStudyMedia",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroMedia",
      type: "caseStudyMedia",
      group: "media",
      description: "Falls back to card media when empty.",
    }),
    defineField({
      name: "links",
      type: "object",
      group: "story",
      fields: [
        defineField({
          name: "figma",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "behance",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        }),
        defineField({
          name: "live",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
    defineField({
      name: "overview",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "challenge",
      type: "text",
      rows: 5,
      group: "story",
    }),
    defineField({
      name: "outcome",
      type: "text",
      rows: 5,
      group: "story",
    }),
    defineField({
      name: "scope",
      title: "My role",
      type: "object",
      group: "story",
      description:
        "What you personally contributed. Keep the summary and the list from repeating each other.",
      fields: [
        defineField({
          name: "summary",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "responsibilities",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),
    defineField({
      name: "personas",
      type: "array",
      group: "story",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
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
          ],
          preview: { select: { title: "title", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "chapters",
      type: "array",
      group: "story",
      description:
        "The story, in as many chapters as the project needs. They are numbered by position, so there is no fixed set of stages to fill.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Anchor",
              type: "string",
              description:
                "Optional. Falls back to a slug of the title. Set it to keep a shared link working while the title is still being edited.",
              validation: (Rule) =>
                Rule.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                  name: "lowercase slug",
                }),
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "lede",
              type: "text",
              rows: 3,
              description:
                "The chapter's argument in one line, set above the body.",
            }),
            defineField({
              name: "list",
              type: "object",
              description:
                "Optional. For the handful of things that are genuinely a list, such as the steps of a sequence. Use prose for everything else.",
              fields: [
                defineField({
                  name: "ordered",
                  type: "boolean",
                  description: "Numbered rather than bulleted.",
                  initialValue: false,
                }),
                defineField({
                  name: "items",
                  type: "array",
                  of: [defineArrayMember({ type: "string" })],
                  validation: (Rule) => Rule.required().min(1),
                }),
              ],
            }),
            defineField({
              name: "body",
              type: "array",
              of: [defineArrayMember({ type: "text", rows: 5 })],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "media",
              type: "array",
              of: [defineArrayMember({ type: "caseStudyMedia" })],
            }),
            defineField({
              name: "decisions",
              title: "Key decisions",
              type: "array",
              description:
                "Optional callout. Two to four decisions worth scanning. Leave it empty where the prose already makes the point.",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: { select: { title: "title", subtitle: "lede" } },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "caseStudyMedia" })],
    }),
    defineField({
      name: "reflection",
      type: "text",
      rows: 6,
      group: "story",
    }),
    defineField({
      name: "disclaimer",
      type: "text",
      rows: 4,
      group: "story",
    }),
    defineField({
      name: "seo",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "order",
      type: "number",
      group: "card",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      group: "card",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      media: "cardMedia.image",
    },
  },
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
