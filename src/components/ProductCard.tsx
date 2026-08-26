"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Producto } from "@/types";
import { CheckIcon } from "@/components/icons";
import { formatPrecio, unsplashUrl } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";

export function ProductCard({ producto }: { producto: Producto }) {
  const addItem = useCartStore((s) => s.addItem);
  const [añadido, setAñadido] = useState(false);
  const [pops, setPops] = useState<number[]>([]);

  function handleAdd() {
    addItem(producto.id, 1);
    setAñadido(true);
    setTimeout(() => setAñadido(false), 1400);

    const id = Date.now();
    setPops((prev) => [...prev, id]);
    setTimeout(() => setPops((prev) => prev.filter((p) => p !== id)), 700);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand/10">
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        {producto.destacado && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white">
            Destacado
          </span>
        )}
        <Image
          src={unsplashUrl(producto.imagenId, 640)}
          alt={producto.nombre}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* h2: es el único nivel de encabezado bajo el h1 del catálogo, no
            hay una cabecera de sección intermedia. */}
        <h2 className="font-semibold text-foreground">{producto.nombre}</h2>
        <p className="flex-1 text-sm text-muted">{producto.descripcion}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {formatPrecio(producto.precio)}
          </span>
          <div className="relative">
            <AnimatePresence>
              {pops.map((id) => (
                <motion.span
                  key={id}
                  initial={{ opacity: 1, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -32, scale: 1.1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="pointer-events-none absolute -top-1 right-2 text-sm font-bold text-brand"
                >
                  +1
                </motion.span>
              ))}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-70"
            >
              {añadido ? (
                <>
                  <CheckIcon className="h-4 w-4" /> Añadido
                </>
              ) : (
                "Añadir al carrito"
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
