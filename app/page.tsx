import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

export default async function Home() {
  const products = await apiFetch<Product[]>("/products", {
    next: { revalidate: 300 },
  });
  const categories = [...new Set(products.map((product) => product.category))];
  const featuredProducts = [...products]
    .sort((left, right) => right.rating.rate - left.rating.rate)
    .slice(0, 3);
  const averagePrice =
    products.reduce((total, product) => total + product.price, 0) /
    products.length;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CommerceHub Dashboard",
    description:
      "An SSR-powered e-commerce dashboard built with Next.js and the Fake Store API.",
    url: absoluteUrl("/"),
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <section className="grid gap-8 rounded-[2rem] bg-slate-900 px-8 py-12 text-white shadow-2xl shadow-slate-300/30 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
            Next.js E-commerce Dashboard
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Server-rendered products, client-managed cart, and shareable filters.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Browse catalog data from the Fake Store API, filter products on the
            client, and keep shopping cart state persisted locally with Redux.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Browse products
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-400 hover:bg-slate-800"
            >
              Login for cart access
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-slate-300">Products available</p>
            <p className="mt-3 text-4xl font-bold">{products.length}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-slate-300">Categories</p>
            <p className="mt-3 text-4xl font-bold">{categories.length}</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-slate-300">Average price</p>
            <p className="mt-3 text-4xl font-bold">
              {formatCurrency(averagePrice)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featuredProducts.map((product) => (
          <article
            key={product.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.category}
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              {product.title}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Rating {product.rating.rate.toFixed(1)} / 5 from{" "}
              {product.rating.count} reviews
            </p>
            <p className="mt-6 text-2xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </p>
            <Link
              href={`/products/${product.id}`}
              className="mt-6 inline-flex text-sm font-semibold text-slate-900 transition hover:text-slate-700"
            >
              View product
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
