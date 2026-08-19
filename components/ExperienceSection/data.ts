import elementsLogo from "./elements.png";
import kimpLogo from "./kimp.png";
import tracifiedLogo from "./tracified.png";
import villvayLogoDark from "./villvay-dark.png";
import villvayLogoLight from "./villvay-light.png";
import zMessengerLogo from "./zmessenger.png";

export const experiences = [
  {
    role: "Senior UI/UX Designer",
    companylogoLight: villvayLogoLight,
    companyLogoDark: villvayLogoDark,
    company: "Villvay Systems (Pvt) Ltd.",
    link: "https://villvay.com",
    year: "April 2024 - Present",
    responsibility: [
      "Designed UI/UX for global B2B eCommerce websites and mobile apps.",
      "Created interactive prototypes and high-fidelity mockups using standard design systems and best practices.",
      "Applied accessibility standards such as WCAG throughout my designs.",
      "Used AI-assisted workflows for concept exploration, content drafting and research synthesis to speed up early-stage design.",
      "Collaborated with development teams to enhance overall UX for client websites.",
    ],
    techStacks: [
      "Figma",
      "Adobe XD",
      "Design Systems",
      "WCAG",
      "AI-Assisted Workflows",
    ],
  },
  {
    role: "Multimedia Engineer",
    companylogoLight: tracifiedLogo,
    companyLogoDark: tracifiedLogo,
    company: "Tracified (Pvt) Ltd.",
    link: "https://tracified.com",
    year: "March 2022 - February 2024",
    responsibility: [
      "Created interactive prototypes, high and low fidelity UI mockups for Tracified products and features.",
      "Worked with development teams to streamline best UX practices within the products.",
      "Produced digital content for company social media platforms and initiated branding across all digital and print media.",
    ],
    techStacks: ["Figma", "Adobe XD", "Adobe Illustrator", "Adobe Photoshop"],
  },
  {
    role: "Designer - Remote",
    companylogoLight: kimpLogo,
    companyLogoDark: kimpLogo,
    company: "Kimp.io (Doto Media Inc.)",
    link: "https://www.kimp.io",
    year: "June 2020 - March 2022",
    responsibility: [
      "Delivered design work for clients across the US, UK and Canada, covering branding documents, logos, social media graphics, web visuals, slide decks and print artwork.",
      "Used Photoshop and Illustrator for graphics, InDesign for book and editorial layouts, and Figma for UI design.",
      "Worked to tight turnaround targets inside a high-volume remote design team.",
    ],
    techStacks: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe InDesign",
      "Figma",
    ],
  },
  {
    role: "Digital Designer",
    companylogoLight: zMessengerLogo,
    companyLogoDark: zMessengerLogo,
    company: "zMessenger (Pvt) Ltd.",
    link: "https://www.zmessenger.com/",
    year: "November 2019 - June 2020",
    responsibility: [
      "Produced digital and printed artworks for key brand clients, adhering to corporate brand guidelines and moodboards within demanding timelines.",
      "Created graphics and videos using Adobe Photoshop, Illustrator, After Effects and Premiere Pro.",
      "Built HTML/GIF web banners using the Bannersnack platform and engaged in experimental UI/UX design projects using Adobe XD.",
    ],
    techStacks: [
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe After Effects",
      "Adobe Premiere Pro",
      "Adobe XD",
    ],
  },
  {
    role: "Freelance Digital Strategist/Designer",
    companylogoLight: elementsLogo,
    companyLogoDark: elementsLogo,
    company: "Elements Sri Lanka",
    link: "https://elements.lk",
    year: "January 2018 - September 2019",
    responsibility: [
      "Managed web, graphic and video projects alongside digital marketing initiatives for clients in Sri Lanka and Australia, handling strategy, design and production end to end.",
      "Worked directly with clients on scoping, timelines and revisions, delivering branding, print and social assets.",
      "Built and maintained WordPress and static HTML/CSS sites, and ran campaigns through Meta Ads Manager and Google Ads.",
    ],
    techStacks: [
      "WordPress",
      "HTML",
      "CSS",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Adobe Premiere Pro",
      "Adobe After Effects",
    ],
  },
] as const;

export type CareerPosition = (typeof experiences)[number];
