import type { Metadata } from "next";
import ProductsCatalog from "@/components/ProductsCatalog";
import { apiFetch } from "@/lib/api";
import { parseProductFilters } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the full Fake Store catalog with server-side sorting and client-side search, category, and price filters.",
  alternates: {
    canonical: "/products",
  },
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseProductFilters(resolvedSearchParams);
  const canonicalParams = new URLSearchParams();

  if (filters.search) {
    canonicalParams.set("search", filters.search);
  }

  if (filters.category) {
    canonicalParams.set("category", filters.category);
  }

  if (filters.minPrice) {
    canonicalParams.set("minPrice", filters.minPrice);
  }

  if (filters.maxPrice) {
    canonicalParams.set("maxPrice", filters.maxPrice);
  }

  if (filters.sort !== "asc") {
    canonicalParams.set("sort", filters.sort);
  }

  if (filters.page > 1) {
    canonicalParams.set("page", String(filters.page));
  }

  const [products, categories] = await Promise.all([
    apiFetch<Product[]>("/products", {
      query: { sort: filters.sort },
      next: { revalidate: 300 },
    }),
    apiFetch<string[]>("/products/categories", {
      next: { revalidate: 300 },
    }),
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CommerceHub products",
    description: "Server-rendered product catalog with client-side filters.",
    url: absoluteUrl(
      canonicalParams.toString()
        ? `/products?${canonicalParams.toString()}`
        : "/products",
    ),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Product catalog
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Explore all products
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          The catalog is fetched on the server for fast initial rendering, then
          refined on the client with shareable search, category, price, and
          pagination controls.
        </p>
      </section>

      <ProductsCatalog
        products={products}
        categories={categories}
        initialFilters={filters}
      />
    </div>
  );
}