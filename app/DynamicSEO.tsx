// components/DynamicSEO.tsx
"use client";

import { useSettings } from "@/Context/SettingsContext";
import Head from "next/head";


export default function DynamicSEO() {
  const { settings } = useSettings();

  const title = settings?.seoSettings?.metaTitle;
  const description =
    settings?.seoSettings?.metaDescription ||
    "Premium cars for discerning drivers.";
  const keywords = settings?.seoSettings?.keywords || "cars, luxury, auto";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      {/* Optional: OG tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
