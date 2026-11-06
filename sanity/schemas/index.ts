import { defineArrayMember, defineField, defineType } from "sanity";

const slug = defineField({ name: "slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() });
const order = defineField({ name: "order", type: "number", description: "Lower numbers show first" });
const noDash = (v?: string) => (v && /\u2014/.test(v) ? "Do not use em dashes" : true);

// Table
export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({ name: "hasHeader", type: "boolean", initialValue: true }),
    defineField({
      name: "rows",
      type: "array",
      of: [
        defineArrayMember({
          name: "tableRow",
          type: "object",
          fields: [defineField({ name: "cells", type: "array", of: [{ type: "string" }] })],
          preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells || []).join(" | ") }) },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Table" }) },
});

const body = defineField({
  name: "body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Intro", value: "lead" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [{ name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "string", title: "URL or path" }] }],
      },
    }),
    defineArrayMember({ type: "table" }),
  ],
});

// Article
export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [{ name: "content", default: true }, { name: "seo" }, { name: "listing" }],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required().custom(noDash) }),
    { ...slug, group: "content" },
    defineField({ name: "category", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "categoryKey",
      type: "string",
      group: "content",
      options: { list: ["rescue", "agents", "ai", "saas", "custom", "web", "mobile", "automation"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "readTime", type: "number", group: "content", title: "Read time (minutes)" }),
    defineField({ name: "author", type: "reference", to: [{ type: "teamMember" }], group: "content" }),
    defineField({ name: "publishedAt", type: "date", group: "content" }),
    defineField({ name: "image", type: "image", group: "content", options: { hotspot: true }, description: "Overrides the image path" }),
    defineField({ name: "imagePath", type: "string", group: "content", description: "Local image path, used when no image is uploaded" }),
    defineField({ name: "imageAlt", type: "string", group: "content" }),
    defineField({ name: "takeaways", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({
      name: "toc",
      title: "Contents",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "object", fields: [{ name: "label", type: "string" }, { name: "anchor", type: "string" }] })],
    }),
    { ...body, group: "content" },
    defineField({
      name: "faq",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "object", fields: [{ name: "q", type: "string", title: "Question" }, { name: "a", type: "text", title: "Answer" }] })],
    }),
    defineField({
      name: "ctas",
      title: "Buttons",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [{ name: "label", type: "string" }, { name: "href", type: "string" }, { name: "primary", type: "boolean" }],
        }),
      ],
    }),
    defineField({ name: "related", type: "array", group: "content", of: [{ type: "reference", to: [{ type: "article" }] }], validation: (r) => r.max(3) }),
    defineField({ name: "seoTitle", type: "string", group: "seo" }),
    defineField({ name: "description", type: "text", rows: 3, group: "seo", validation: (r) => r.max(170) }),
    defineField({ name: "keywords", type: "string", group: "seo" }),
    defineField({ name: "summary", type: "text", rows: 3, group: "listing" }),
    defineField({ name: "homeTeaser", type: "string", group: "listing" }),
    defineField({ name: "cardAlt", type: "string", group: "listing" }),
    defineField({ name: "featured", type: "boolean", group: "listing" }),
    { ...order, group: "listing" },
    defineField({ name: "homeOrder", type: "number", group: "listing", description: "Position in the home page insights block (0 is the large card)" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category" } },
});

// Case study
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    { ...slug, options: { source: "name", maxLength: 96 } },
    defineField({ name: "title", type: "string", validation: (r) => r.required().custom(noDash) }),
    defineField({
      name: "isDesignStudy",
      title: "Product design study",
      type: "boolean",
      initialValue: true,
      description: "Design studies are labelled Product design study and never presented as client work",
    }),
    defineField({ name: "industry", type: "string" }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ["custom-software", "full-stack", "mobile", "ai", "automation"] },
    }),
    defineField({ name: "summary", type: "text", rows: 2 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imagePath", type: "string" }),
    defineField({ name: "imageAlt", type: "string" }),
    defineField({ name: "railAlt", type: "string" }),
    defineField({ name: "heroAlt", type: "string" }),
    defineField({
      name: "snapshot",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [{ name: "label", type: "string" }, { name: "value", type: "string" }] })],
    }),
    defineField({ name: "challenge", type: "text" }),
    defineField({ name: "approach", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "delivered",
      type: "array",
      of: [defineArrayMember({ type: "object", fields: [{ name: "title", type: "string" }, { name: "text", type: "string" }] })],
    }),
    defineField({
      name: "results",
      type: "array",
      description: "Only real, approved results. The block is hidden while empty",
      of: [defineArrayMember({ type: "object", fields: [{ name: "value", type: "string" }, { name: "label", type: "string" }] })],
    }),
    defineField({ name: "next", title: "Next project", type: "reference", to: [{ type: "caseStudy" }] }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "description", type: "text", rows: 3 }),
    order,
  ],
  preview: { select: { title: "name", subtitle: "industry" } },
});

// Testimonial
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", type: "text", validation: (r) => r.required().custom(noDash) }),
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "caseStudy", type: "reference", to: [{ type: "caseStudy" }] }),
    defineField({ name: "approved", type: "boolean", initialValue: false, description: "Only approved testimonials appear on the site" }),
    order,
  ],
});

// Client logo
export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client logo",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "logo", type: "image", validation: (r) => r.required() }),
    defineField({ name: "approved", type: "boolean", initialValue: false, description: "Only approved, real client logos appear on the site" }),
    order,
  ],
});

// Team member
export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    { ...slug, options: { source: "name", maxLength: 96 } },
    defineField({ name: "role", type: "string" }),
    defineField({ name: "short", type: "string", title: "Card line" }),
    defineField({ name: "bio", type: "array", of: [{ type: "text" }] }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({ name: "imagePath", type: "string" }),
    defineField({ name: "linkedin", type: "url" }),
    defineField({ name: "leadership", type: "boolean", initialValue: false }),
    order,
  ],
  preview: { select: { title: "name", subtitle: "role", media: "image" } },
});

// Job opening
export const job = defineType({
  name: "job",
  title: "Job opening",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    slug,
    defineField({ name: "type", type: "string", description: "For example Internship or Project based" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "open", type: "boolean", initialValue: true }),
    order,
  ],
});

export const schemaTypes = [article, caseStudy, testimonial, clientLogo, teamMember, job, table];
