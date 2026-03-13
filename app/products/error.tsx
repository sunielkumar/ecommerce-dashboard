"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

type ProductsErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsErrorPage({
  error,
  reset,
}: ProductsErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <ErrorState
        title="The product catalog is unavailable right now."
        description="Please try again. If the issue persists, the Fake Store API may be temporarily unavailable."
      />
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Try again
      </button>
    </div>
  );
}
