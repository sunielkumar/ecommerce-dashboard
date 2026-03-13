import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Page not found
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">
        We could not find that page
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        The product or route you requested does not exist, or it may have been
        moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          View products
        </Link>
        <Link
          href="/"
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
