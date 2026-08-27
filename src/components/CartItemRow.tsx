"use client";

import Image from "next/image";
import type { CartItem } from "@/types";
import { TrashIcon } from "@/components/icons";
import { formatPrecio, unsplashUrl } from "@/lib/format";
import { buscarProducto } from "@/lib/products";
import { useCartStore } from "@/lib/store/cart-store";

export function CartItemRow({ item }: { item: CartItem }) {
  const setCantidad = useCartStore((s) => s.setCantidad);
  const removeItem = useCartStore((s) => s.removeItem);
  const producto = buscarProducto(item.productoId);

  if (!producto) return null;

  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
          <Image
            src={unsplashUrl(producto.imagenId, 128)}
            alt={producto.nombre}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <p className="min-w-0 flex-1 truncate font-medium text-foreground">
          {producto.nombre}
        </p>

        <button
          type="button"
          aria-label="Eliminar del carrito"
          onClick={() => removeItem(item.productoId)}
          className="shrink-0 text-foreground/40 transition hover:text-danger"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-between pl-[80px]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() => setCantidad(item.productoId, item.cantidad - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:border-brand hover:text-brand"
          >
            −
          </button>
          <span className="w-6 text-center font-medium text-foreground">
            {item.cantidad}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => setCantidad(item.productoId, item.cantidad + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition hover:border-brand hover:text-brand"
          >
            +
          </button>
        </div>

        <p className="font-semibold text-foreground">
          {formatPrecio(producto.precio * item.cantidad)}
        </p>
      </div>
    </div>
  );
}
