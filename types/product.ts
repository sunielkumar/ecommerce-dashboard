export type SortOrder = "asc" | "desc";

export type Rating = {
  rate: number;
  count: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
};

export type ProductFilters = {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOrder;
  page: number;
};