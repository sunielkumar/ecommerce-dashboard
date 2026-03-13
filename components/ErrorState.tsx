import Link from "next/link";

type ErrorStateProps = {
  title: string;
  description: string;
};

export default function ErrorState({
  title,
  description,
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
        Unable to load data
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/products"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Back to products
        </Link>
        <Link
          href="/"
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
