"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { filterProducts, paginateProducts, PRODUCTS_PER_PAGE } from "@/lib/products";
import type { Product, ProductFilters, SortOrder } from "@/types/product";

type ProductsCatalogProps = {
  products: Product[];
  categories: string[];
  initialFilters: ProductFilters;
};

export default function ProductsCatalog({
  products,
  categories,
  initialFilters,
}: ProductsCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(initialFilters.search);
  const [category, setCategory] = useState(initialFilters.category);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sort, setSort] = useState<SortOrder>(initialFilters.sort);
  const [page, setPage] = useState(initialFilters.page);

  useEffect(() => {
    setSearch(initialFilters.search);
    setCategory(initialFilters.category);
    setMinPrice(initialFilters.minPrice);
    setMaxPrice(initialFilters.maxPrice);
    setSort(initialFilters.sort);
    setPage(initialFilters.page);
  }, [initialFilters]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page,
      }),
    [products, search, category, minPrice, maxPrice, sort, page],
  );

  const pagination = useMemo(
    () => paginateProducts(filteredProducts, page, PRODUCTS_PER_PAGE),
    [filteredProducts, page],
  );

  const updateUrl = useCallback(
    (
      nextValues: Partial<ProductFilters>,
      historyMode: "push" | "replace" = "push",
    ) => {
      const params = new URLSearchParams();
      const nextState: ProductFilters = {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page,
        ...nextValues,
      };

      if (nextState.search) {
        params.set("search", nextState.search);
      }

      if (nextState.category) {
        params.set("category", nextState.category);
      }

      if (nextState.minPrice) {
        params.set("minPrice", nextState.minPrice);
      }

      if (nextState.maxPrice) {
        params.set("maxPrice", nextState.maxPrice);
      }

      if (nextState.sort !== "asc") {
        params.set("sort", nextState.sort);
      }

      if (nextState.page > 1) {
        params.set("page", String(nextState.page));
      }

      startTransition(() => {
        const query = params.toString();
        const nextUrl = query ? `${pathname}?${query}` : pathname;
        const navigate = historyMode === "push" ? router.push : router.replace;

        navigate(nextUrl, {
          scroll: false,
        });
      });
    },
    [category, maxPrice, minPrice, page, pathname, router, search, sort],
  );

  useEffect(() => {
    if (page === pagination.currentPage) {
      return;
    }

    setPage(pagination.currentPage);
    updateUrl({ page: pagination.currentPage }, "replace");
  }, [page, pagination.currentPage, updateUrl]);

  const handleApplyFilters = () => {
    setPage(1);
    updateUrl({
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("asc");
    setPage(1);
    updateUrl({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "asc",
      page: 1,
    });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    updateUrl({ page: nextPage });
  };

  const handleSortChange = (value: SortOrder) => {
    setSort(value);
    setPage(1);
    updateUrl({ sort: value, page: 1 });
  };

  return (
    <div className="space-y-6">
      <SearchBar
        value={search}
        onChange={setSearch}
        onSubmit={handleApplyFilters}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Filters
          categories={categories}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={setCategory}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <label className="grid gap-2 text-sm font-medium text-slate-700 lg:min-w-48">
          Sort order
          <select
            value={sort}
            onChange={(event) => handleSortChange(event.target.value as SortOrder)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
          >
            <option value="asc">Price low to high</option>
            <option value="desc">Price high to low</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {pagination.items.length} of {pagination.totalItems} matching products
        </p>
        {isPending ? (
          <p className="text-sm font-medium text-slate-500">Updating catalog...</p>
        ) : null}
      </div>

      {pagination.items.length ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pagination.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyState
          title="No products match these filters"
          description="Try changing the category, search term, or price range to see more items."
          actionLabel="Clear filters"
          actionHref="/products"
        />
      )}
    </div>
  );
}
