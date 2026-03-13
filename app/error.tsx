"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <ErrorState
        title="Something went wrong while loading the dashboard."
        description="Please try again. If the Fake Store API is unavailable, some pages may stay temporarily inaccessible."
      />
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Reload page
      </button>
    </div>
  );
}
