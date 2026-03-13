import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddToCartPayload, CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  isHydrated: boolean;
};

const initialState: CartState = {
  items: [],
  isHydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.isHydrated = true;
    },
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const { product, quantity } = action.payload;
      const safeQuantity = Math.max(1, quantity);
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += safeQuantity;
        return;
      }

      state.items.push({ ...product, quantity: safeQuantity });
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (cartItem) => cartItem.id === action.payload.id,
      );

      if (!item) {
        return;
      }

      item.quantity = Math.max(1, action.payload.quantity);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrateCart, addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;