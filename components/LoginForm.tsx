"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { loginUser } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const DEMO_USERNAME = "mor_2314";
const DEMO_PASSWORD = "83r5^_";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState(DEMO_USERNAME);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  useEffect(() => {
    if (auth.status === "authenticated") {
      router.push("/cart");
    }
  }, [auth.status, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(loginUser({ username, password }));
  };

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Fake Store login
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        This uses the Fake Store authentication endpoint and keeps the returned
        token in local storage for client-only cart access.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Username
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          />
        </label>

        {auth.error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {auth.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={auth.status === "loading"}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {auth.status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Demo credentials</p>
        <p className="mt-2">Username: {DEMO_USERNAME}</p>
        <p>Password: {DEMO_PASSWORD}</p>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Want to keep browsing first?{" "}
        <Link href="/products" className="font-semibold text-slate-900">
          View products
        </Link>
      </p>
    </div>
  );
}
