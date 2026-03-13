"use client";

import Link from "next/link";
import { logout } from "@/redux/authSlice";
import { clearCart } from "@/redux/cartSlice";
import { useCart } from "@/hooks/useCart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { totalQuantity } = useCart();
  const username = useAppSelector((state) => state.auth.username);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link href="/" className="text-xl font-bold text-slate-900">
            CommerceHub
          </Link>
          <p className="text-sm text-slate-500">
            Server-rendered catalog with client-side cart management
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
          <Link
            href="/products"
            className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cart ({totalQuantity})
          </Link>
          {username ? (
            <>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                Signed in as {username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}