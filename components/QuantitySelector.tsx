"use client";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export default function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  const safeValue = Math.min(Math.max(value, min), max);

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, safeValue - 1))}
        className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={safeValue}
        onChange={(event) => onChange(Number(event.target.value) || min)}
        className="w-12 border-x border-slate-200 bg-transparent px-2 py-2 text-center text-sm font-semibold text-slate-900 outline-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, safeValue + 1))}
        className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
      >
        +
      </button>
    </div>
  );
}
