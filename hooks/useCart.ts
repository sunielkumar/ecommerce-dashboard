"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";

export function useCart() {
  const items = useAppSelector((state) => state.cart.items);

  return useMemo(() => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    return {
      items,
      totalQuantity,
      subtotal,
    };
  }, [items]);
}
