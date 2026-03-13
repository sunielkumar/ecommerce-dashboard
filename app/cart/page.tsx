import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review cart items, adjust quantities, and see the running total with client-side Redux state.",
};

export default function CartPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Shopping cart
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
          Manage your order
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
          Cart data is managed entirely on the client with Redux and persisted in
          local storage for a seamless returning experience.
        </p>
      </section>

      <CartView />
    </div>
  );
}