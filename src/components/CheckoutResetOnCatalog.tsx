"use client";

import { useEffect } from "react";
import { useCheckoutStore } from "@/lib/store/checkout-store";

/**
 * Limpia el estado del checkout (envío, pedido) al aterrizar en el
 * catálogo — llegar aquí significa que el flujo terminó o se abandonó.
 *
 * Deliberadamente en el MOUNT del catálogo y no en el unmount de la
 * confirmación: un efecto de limpieza en el unmount es no-idempotente
 * (setup vacío, cleanup con side-effect), y el doble mount-unmount-mount
 * que hace React en desarrollo (Strict Mode) lo dispara antes de tiempo,
 * vaciando el pedido y hurtando la página de confirmación. Un reset() en
 * el mount es idempotente (llamarlo dos veces no cambia nada) y por tanto
 * seguro bajo ese doble-invoke.
 */
export function CheckoutResetOnCatalog() {
  const reset = useCheckoutStore((s) => s.reset);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
