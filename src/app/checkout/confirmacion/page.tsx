"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon } from "@/components/icons";
import { formatPrecio } from "@/lib/format";
import { buscarProducto } from "@/lib/products";
import { useCheckoutStore } from "@/lib/store/checkout-store";

export default function ConfirmacionPage() {
  const router = useRouter();
  const pedido = useCheckoutStore((s) => s.pedido);
  const envio = useCheckoutStore((s) => s.envio);
  // Snapshot al montar: el pedido se limpia (ver catálogo) cuando el
  // usuario se va de esta página, así que el guard solo debe mirar si
  // había un pedido válido AL LLEGAR, no reaccionar a que luego se vacíe.
  const [teniaPedidoAlEntrar] = useState(() => pedido !== null);

  // Guard de ruta: solo se llega aquí tras un pago confirmado.
  useEffect(() => {
    if (!teniaPedidoAlEntrar) router.replace("/carrito");
  }, [teniaPedidoAlEntrar, router]);

  if (!pedido || !envio) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckIcon className="h-7 w-7" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        ¡Pedido confirmado!
      </h1>
      <p className="mt-2 text-muted">
        Número de pedido{" "}
        <span className="font-mono font-semibold text-foreground">
          {pedido.numeroPedido}
        </span>
      </p>

      <div className="mt-8 w-full rounded-2xl border border-border bg-surface px-5 text-left">
        {pedido.items.map((item) => {
          const producto = buscarProducto(item.productoId);
          if (!producto) return null;
          return (
            <div
              key={item.productoId}
              className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
            >
              <span className="text-sm text-foreground">
                {producto.nombre}{" "}
                <span className="text-muted">× {item.cantidad}</span>
              </span>
              <span className="font-medium text-foreground">
                {formatPrecio(producto.precio * item.cantidad)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-5">
        <span className="text-muted">Total pagado</span>
        <span className="text-xl font-bold text-foreground">
          {formatPrecio(pedido.subtotal)}
        </span>
      </div>

      <div className="mt-4 w-full rounded-2xl border border-border bg-surface-muted p-5 text-left text-sm text-foreground/70">
        <p className="mb-1 font-medium text-foreground">Enviado a</p>
        <p>{envio.nombre}</p>
        <p>{envio.direccion}</p>
        <p>
          {envio.ciudad}, {envio.codigoPostal} — {envio.pais}
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}
