"use client";

type FiltersProps = {
  categories: string[];
  category: string;
  minPrice: string;
  maxPrice: string;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function Filters({
  categories,
  category,
  minPrice,
  maxPrice,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
  onReset,
}: FiltersProps) {
  return (
    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Category
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Minimum price
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder="0"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Maximum price
        <input
          type="number"
          min="0"
          inputMode="decimal"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="1000"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
        />
      </label>

      <button
        type="button"
        onClick={onApply}
        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Apply
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
      >
        Reset
      </button>
    </div>
  );
}