import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartPanel from "@/components/AddToCartPanel";
import { ApiError, apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import type { Product } from "@/types/product";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

async function getProduct(id: string): Promise<Product> {
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    notFound();
  }

  try {
    return await apiFetch<Product>(`/products/${productId}`, {
      next: { revalidate: 300 },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/products/${product.id}`,
    },
    openGraph: {
      title: product.title,
      description: product.description,
      url: absoluteUrl(`/products/${product.id}`),
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.image,
    description: product.description,
    category: product.category,
    url: absoluteUrl(`/products/${product.id}`),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.rate,
      reviewCount: product.rating.count,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/products/${product.id}`),
    },
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Link
        href="/products"
        className="inline-flex text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        Back to products
      </Link>

      <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="relative min-h-[420px] rounded-[2rem] bg-slate-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-10"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {product.title}
            </h1>
            <p className="mt-4 text-sm text-slate-500">
              Rated {product.rating.rate.toFixed(1)} / 5 from {product.rating.count}{" "}
              customer reviews
            </p>
          </div>

          <p className="text-3xl font-bold text-slate-900">
            {formatCurrency(product.price)}
          </p>

          <p className="text-base leading-7 text-slate-600">
            {product.description}
          </p>

          <AddToCartPanel product={product} />
        </div>
      </section>
    </div>
  );
}