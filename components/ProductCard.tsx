"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency } from "@/lib/products";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/cartSlice";
import type { Product } from "@/types/product";
import QuantitySelector from "@/components/QuantitySelector";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.token));
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
  };

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        <div className="relative flex h-56 items-center justify-center rounded-2xl bg-slate-50 p-6">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 28vw, 100vw"
            className="object-contain p-6"
          />
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {product.category}
          </p>
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900">
            {product.title}
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Rating {product.rating.rate.toFixed(1)} / 5 from {product.rating.count} reviews
          </p>
          <div className="mt-auto pt-6">
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-5 flex flex-col gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              router.push("/login");
              return;
            }

            handleAddToCart();
          }}
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {isAuthenticated ? "Add to cart" : "Login to add items"}
        </button>
      </div>
    </article>
  );
}