"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hydrateAuth } from "@/redux/authSlice";
import { hydrateCart } from "@/redux/cartSlice";
import { store } from "@/redux/store";
import type { StoredAuth } from "@/types/auth";
import type { CartItem } from "@/types/cart";
import { readStorage, removeStorage, writeStorage } from "@/utils/localStorage";

const CART_STORAGE_KEY = "ecommerce-dashboard-cart";
const AUTH_STORAGE_KEY = "ecommerce-dashboard-auth";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedCart = readStorage<CartItem[]>(CART_STORAGE_KEY, []);
    const storedAuth = readStorage<StoredAuth | null>(AUTH_STORAGE_KEY, null);

    dispatch(hydrateCart(storedCart));
    dispatch(hydrateAuth(storedAuth));
  }, [dispatch]);

  useEffect(() => {
    if (!cart.isHydrated) {
      return;
    }

    writeStorage(CART_STORAGE_KEY, cart.items);
  }, [cart.isHydrated, cart.items]);

  useEffect(() => {
    if (!auth.isHydrated) {
      return;
    }

    if (auth.token && auth.username) {
      writeStorage(AUTH_STORAGE_KEY, {
        token: auth.token,
        username: auth.username,
      });
      return;
    }

    removeStorage(AUTH_STORAGE_KEY);
  }, [auth.isHydrated, auth.token, auth.username]);

  return children;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}
