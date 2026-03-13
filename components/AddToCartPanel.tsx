"use client";

import Link from "next/link";
import { useState } from "react";
import QuantitySelector from "@/components/QuantitySelector";
import { addToCart } from "@/redux/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Product } from "@/types/product";

type AddToCartPanelProps = {
  product: Product;
};

export default function AddToCartPanel({ product }: AddToCartPanelProps) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => Boolean(state.auth.token));
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setQuantity(1);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Purchase controls
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Add {quantity} to cart
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-2xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
          >
            Login to add items
          </Link>
        )}
        <p className="text-sm leading-6 text-slate-500">
          Cart items are stored locally in your browser so you can continue where
          you left off.
        </p>
      </div>
    </div>
  );
}
