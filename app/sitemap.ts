import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/tyres`, lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/workshop`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/book`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/faq`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/refunds`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/tyre-disposal`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...servicePages];
}
