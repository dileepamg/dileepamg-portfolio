import digitalContentImage from "@/media/digital-content.jpg";
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
    title: "Digital Content Creation",
    description:
      "Various digital content created for businesses based in Sri Lanka, United States, Australia and United Kingdom.",
    behance: "https://www.behance.net/gallery/99471015/Social-Media-Web",
    image: digitalContentImage,
  },
] as const;
