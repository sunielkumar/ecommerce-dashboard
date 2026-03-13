import type { Product } from "@/types/product";

export type CartItem = Product & {
  quantity: number;
};

export type AddToCartPayload = {
  product: Product;
  quantity: number;
};
