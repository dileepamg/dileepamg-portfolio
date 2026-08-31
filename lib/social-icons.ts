import type { IconType } from "react-icons";
import { FaBehance, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { LuExternalLink, LuMail } from "react-icons/lu";
import { stegaClean } from "@sanity/client/stega";

const labelIcons: Record<string, IconType> = {
  Email: LuMail,
  Behance: FaBehance,
  LinkedIn: FaLinkedin,
  X: FaXTwitter,
  GitHub: FaGithub,
};

export function resolveSocialIcon(href: string, label: string): IconType {
  const cleanHref = stegaClean(href).toLowerCase();
  const cleanLabel = stegaClean(label);

  if (cleanHref.startsWith("mailto:")) return LuMail;
  if (cleanHref.includes("behance.net")) return FaBehance;
  if (cleanHref.includes("linkedin.com")) return FaLinkedin;
  if (cleanHref.includes("github.com")) return FaGithub;
  if (cleanHref.includes("x.com") || cleanHref.includes("twitter.com")) {
    return FaXTwitter;
  }

  return labelIcons[cleanLabel] ?? LuExternalLink;
}
