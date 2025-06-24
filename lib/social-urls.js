import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export const SOCIAL_LINKS = (settings) => {
  // Define social media configurations with their respective icons
  const socialMediaConfig = [
    {
      name: "Facebook",
      url: settings?.socialMedia?.facebook,
      Icon: Facebook,
    },
    {
      name: "Twitter",
      url: settings?.socialMedia?.twitter,
      Icon: Twitter,
    },
    {
      name: "Instagram",
      url: settings?.socialMedia?.instagram,
      Icon: Instagram,
    },
    {
      name: "LinkedIn",
      url: settings?.socialMedia?.linkedin,
      Icon: Linkedin,
    },
  ];

  // Filter out social media links with invalid or missing URLs
  return socialMediaConfig.filter((item) => item.url && typeof item.url === "string" && item.url.trim() !== "");
};