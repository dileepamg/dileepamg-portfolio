import digitalContentImage from "@/media/digital-content.jpg";
import historyExhibitionImage from "@/media/exhibition-desgn.jpg";
import tracifiedConsumerAppImage from "@/media/tracified-consumer-app.jpg";

export const projects = [
  {
    title: "Tracified Consumer App",
    description:
      "Tracified Consumer App was designed to provide users with a seamless way to explore a product's journey.",
    behance:
      "https://www.behance.net/gallery/191408751/UIUX-Design-Tracified-Consumer-App",
    image: tracifiedConsumerAppImage,
  },
  {
    title: "History Exhibition Design",
    description:
      "Designs for an exhibition showcasing a historical analysis of Sri Lanka from 13th century to 1948.",
    behance: "https://www.behance.net/gallery/191859427/Exhibition-Design-",
    image: historyExhibitionImage,
  },
  {
    title: "Digital Content Creation",
    description:
      "Various digital content created for businesses based in Sri Lanka, United States, Australia and United Kingdom",
    behance: "https://www.behance.net/gallery/99471015/Social-Media-Web",
    image: digitalContentImage,
  },
] as const;
