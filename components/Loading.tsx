type LoadingProps = {
  message?: string;
};

export default function Loading({
  message = "Loading products...",
}: LoadingProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}