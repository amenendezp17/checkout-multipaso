import { create } from "zustand";
import type { CartItem } from "@/types";
import type { ShippingFormValues as ShippingInfo } from "@/lib/schemas";

export interface ResumenPedido {
  numeroPedido: string;
  items: CartItem[];
  subtotal: number;
}

interface CheckoutState {
  envio: ShippingInfo | null;
  envioCompletado: boolean;
  pedido: ResumenPedido | null;
  setEnvio: (datos: ShippingInfo) => void;
  setPedidoConfirmado: (pedido: ResumenPedido) => void;
  reset: () => void;
}

/**
 * Estado del checkout en memoria (no persistido a propósito): sobrevive a la
 * navegación entre pasos (botón "Atrás" conserva los datos), pero se
 * reinicia en una recarga completa, momento en el que el guard de ruta
 * redirige al primer paso.
 */
export const useCheckoutStore = create<CheckoutState>((set) => ({
  envio: null,
  envioCompletado: false,
  pedido: null,
  setEnvio: (datos) => set({ envio: datos, envioCompletado: true }),
  setPedidoConfirmado: (pedido) => set({ pedido }),
  reset: () => set({ envio: null, envioCompletado: false, pedido: null }),
}));
