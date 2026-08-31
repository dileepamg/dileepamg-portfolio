import { caseStudyType } from "./caseStudy";
import { seoAndContentObjectTypes } from "./objects";
import { postType } from "./post";
import { siteContentDocumentTypes } from "./siteContent";

export const schemaTypes = [
  ...seoAndContentObjectTypes,
  ...siteContentDocumentTypes,
  caseStudyType,
  postType,
];
