import type { MetadataRoute } from "next";
import { apiFetch } from "@/lib/api";
import { absoluteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await apiFetch<Product[]>("/products", {
    next: { revalidate: 300 },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/login"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/cart"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/products/${product.id}`),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
