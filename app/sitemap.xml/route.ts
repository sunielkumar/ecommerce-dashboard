import { NextResponse } from "next/server";
import { absoluteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(products: Product[]): string {
  const staticUrls = [
    absoluteUrl("/"),
    absoluteUrl("/products"),
    absoluteUrl("/login"),
    absoluteUrl("/cart"),
  ];

  const productUrls = products.map((product) => absoluteUrl(`/products/${product.id}`));
  const urls = [...staticUrls, ...productUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join("\n")}
</urlset>`;
}

export async function GET() {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = (await response.json()) as Product[];
    const sitemap = buildSitemapXml(products);

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch {
    return new NextResponse("Error generating sitemap", {
      status: 500,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
}
