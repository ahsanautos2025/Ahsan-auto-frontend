import { getSettings } from "@/lib/getSettings";
import HomeContent from "@/components/HomeContent";

export async function generateMetadata() {
  const settings = await getSettings();

  return {
    title: settings?.seoSettings?.metaTitle || "Ahsan Autos",
    description:
      settings?.seoSettings?.metaDescription ||
      "Premium cars for discerning drivers",
    keywords: settings?.seoSettings?.keywords || "cars, luxury, auto",
    openGraph: {
      title: settings?.seoSettings?.metaTitle,
      description: settings?.seoSettings?.metaDescription,
    },
  };
}

export default function Home() {
  return <HomeContent />;
}