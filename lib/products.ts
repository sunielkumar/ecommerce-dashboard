import type { Product, ProductFilters, SortOrder } from "@/types/product";

export const PRODUCTS_PER_PAGE = 6;

function getSingleParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parsePage(value: string | undefined): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function parseProductFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProductFilters {
  const sortValue = getSingleParam(searchParams.sort);
  const sort: SortOrder = sortValue === "desc" ? "desc" : "asc";

  return {
    search: getSingleParam(searchParams.search)?.trim() ?? "",
    category: getSingleParam(searchParams.category) ?? "",
    minPrice: getSingleParam(searchParams.minPrice) ?? "",
    maxPrice: getSingleParam(searchParams.maxPrice) ?? "",
    sort,
    page: parsePage(getSingleParam(searchParams.page)),
  };
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const searchQuery = filters.search.toLowerCase();
  const minPrice = parseOptionalNumber(filters.minPrice);
  const maxPrice = parseOptionalNumber(filters.maxPrice);

  return products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery);
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesMinPrice = minPrice === null || product.price >= minPrice;
    const matchesMaxPrice = maxPrice === null || product.price <= maxPrice;

    return (
      matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });
}

export function paginateProducts<T>(
  items: T[],
  currentPage: number,
  pageSize = PRODUCTS_PER_PAGE,
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    currentPage: safePage,
    totalPages,
    items: items.slice(start, start + pageSize),
    totalItems: items.length,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
