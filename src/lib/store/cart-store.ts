import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { buscarProducto } from "@/lib/products";

interface CartState {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addItem: (productoId: string, cantidad?: number) => void;
  removeItem: (productoId: string) => void;
  setCantidad: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      addItem: (productoId, cantidad = 1) =>
        set((state) => {
          const existente = state.items.find((i) => i.productoId === productoId);
          if (existente) {
            return {
              items: state.items.map((i) =>
                i.productoId === productoId
                  ? { ...i, cantidad: i.cantidad + cantidad }
                  : i
              ),
            };
          }
          return { items: [...state.items, { productoId, cantidad }] };
        }),
      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        })),
      setCantidad: (productoId, cantidad) =>
        set((state) => {
          if (cantidad <= 0) {
            return { items: state.items.filter((i) => i.productoId !== productoId) };
          }
          return {
            items: state.items.map((i) =>
              i.productoId === productoId ? { ...i, cantidad } : i
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "nexotech-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/** Totales derivados del carrito. `hasHydrated` evita parpadeo/mismatch SSR. */
export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const totalUnidades = items.reduce((acc, i) => acc + i.cantidad, 0);
  const subtotal = items.reduce((acc, i) => {
    const producto = buscarProducto(i.productoId);
    return acc + (producto ? producto.precio * i.cantidad : 0);
  }, 0);
  return { totalUnidades, subtotal };
}
