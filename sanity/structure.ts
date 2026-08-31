import type { StructureResolver } from "sanity/structure";

export const singletonTypes = new Set(["siteSettings", "homePage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("siteSettings")
        .title("Site settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.listItem()
        .id("homePage")
        .title("Home page")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home page"),
        ),
      S.divider(),
      S.documentTypeListItem("caseStudy").title("Case studies"),
      S.documentTypeListItem("externalProject").title("External projects"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("motionItem").title("Motion items"),
      S.divider(),
      S.documentTypeListItem("post").title("Blog posts"),
      S.documentTypeListItem("category").title("Blog categories"),
    ]);
