"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/CartItemRow";
import { CartIcon } from "@/components/icons";
import { formatPrecio } from "@/lib/format";
import { useCartStore, useCartTotals } from "@/lib/store/cart-store";

export default function CarritoPage() {
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const { subtotal } = useCartTotals();

  if (!hasHydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <CartIcon className="h-12 w-12 text-foreground/30" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-muted">
          Añade algún producto del catálogo para empezar.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Tu carrito</h1>

      <div className="rounded-2xl border border-border bg-surface px-5">
        {items.map((item) => (
          <CartItemRow key={item.productoId} item={item} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
        <span className="text-muted">Subtotal</span>
        <span className="text-xl font-bold text-foreground">
          {formatPrecio(subtotal)}
        </span>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-2.5 text-center font-medium text-foreground transition hover:border-brand hover:text-brand"
        >
          Seguir comprando
        </Link>
        <Link
          href="/checkout/envio"
          className="rounded-full bg-brand px-6 py-2.5 text-center font-semibold text-white transition hover:bg-brand-dark"
        >
          Continuar
        </Link>
      </div>
    </div>
  );
}
