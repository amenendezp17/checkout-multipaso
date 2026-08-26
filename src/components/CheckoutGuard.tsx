"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useCheckoutStore } from "@/lib/store/checkout-store";

/**
 * Guard de ruta del checkout, aislado en su propio componente sin salida
 * visual. Si viviera en CheckoutLayout, sus suscripciones a los stores
 * forzarían un re-render del árbol que envuelve <AnimatePresence>, y eso
 * remonta la página activa (y con ella su formulario) cada vez que el
 * carrito termina de hidratarse desde localStorage.
 */
export function CheckoutGuard() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const pedido = useCheckoutStore((s) => s.pedido);

  // Guard global: sin productos en el carrito no hay checkout que hacer.
  // Excepción: pedido confirmado. Tiene que ser amplia (cualquier ruta de
  // checkout, no solo /confirmacion): el pago vacía el carrito y navega a
  // confirmación en dos pasos separados (estado síncrono vs. navegación
  // asíncrona de Next), así que hay una ventana real en la que seguimos en
  // /checkout/pago con el carrito ya vacío. Acotar la excepción a la ruta
  // de confirmación pierde esa ventana y rebota a /carrito antes de llegar.
  useEffect(() => {
    if (!hasHydrated) return;
    if (pedido) return;
    if (items.length === 0) router.replace("/carrito");
  }, [hasHydrated, items.length, pedido, router]);

  return null;
}
