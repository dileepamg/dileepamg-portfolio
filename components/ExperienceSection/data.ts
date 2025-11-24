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
      "Designed UI/UX for B2B eCommerce websites and mobile apps.",
      "Created interactive prototypes and high-fidelity mockups using standard design systems.",
      "Collaborated with developers to enhance overall UX for client websites.",
    ],
    techStacks: ["Figma", "Adobe XD", "Design Systems"],
  },
  {
    role: "Multimedia Engineer",
    companylogoLight: tracifiedLogo,
    companyLogoDark: tracifiedLogo,
    company: "Tracified (Pvt) Ltd.",
    link: "https://tracified.com",
    year: "March 2022 - February 2024",
    responsibility: [
      "Created interactive prototypes, high and low fidelity mockups for Tracified products.",
      "Collaborated with development teams to improve UX practices.",
      "Produced digital content and established consistent branding across digital and print media.",
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
      "Created branding documents, logos, social media graphics, and web visuals for clients in the US, UK, and Canada.",
      "Worked on UI designs using Figma and visual assets using Adobe tools.",
      "Handled diverse digital design and print requirements efficiently.",
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
      "Produced digital and print artworks for key brand clients following brand guidelines.",
      "Created graphics and videos using Adobe Suite and HTML/GIF banners with Bannersnack.",
      "Explored experimental UI/UX projects using Adobe XD.",
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
    link: "http://elements.lk",
    year: "January 2018 - September 2019",
    responsibility: [
      "Managed and designed web, graphic, and video projects for clients in Sri Lanka and Australia.",
      "Executed digital marketing campaigns using Meta Ads Manager and Google Ads.",
      "Developed static web projects using WordPress, HTML, and CSS.",
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
