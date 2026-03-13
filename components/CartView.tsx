"use client";

import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import QuantitySelector from "@/components/QuantitySelector";
import { formatCurrency } from "@/lib/products";
import { removeFromCart, updateQuantity } from "@/redux/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCart } from "@/hooks/useCart";

export default function CartView() {
  const dispatch = useAppDispatch();
  const { items, subtotal, totalQuantity } = useCart();
  const username = useAppSelector((state) => state.auth.username);

  if (!username) {
    return (
      <EmptyState
        title="Login required"
        description="Sign in to unlock cart management and keep your selected products stored locally."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the catalog and add a few products to start building an order."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[120px_minmax(0,1fr)]"
          >
            <div className="relative h-28 rounded-2xl bg-slate-50">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="120px"
                className="object-contain p-4"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {item.category}
                  </p>
                  <Link
                    href={`/products/${item.id}`}
                    className="mt-2 block text-lg font-semibold text-slate-900 transition hover:text-slate-700"
                  >
                    {item.title}
                  </Link>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(quantity) =>
                    dispatch(updateQuantity({ id: item.id, quantity }))
                  }
                />
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  Remove item
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Order summary
        </p>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Total items</span>
            <span>{totalQuantity}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
        </div>

        <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          Checkout is intentionally out of scope for this exercise, but the cart
          state is fully client-managed and persisted in local storage.
        </p>
      </aside>
    </div>
  );
}
