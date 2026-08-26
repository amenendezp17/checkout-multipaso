"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogoMark, CartIcon } from "@/components/icons";
import { useCartStore, useCartTotals } from "@/lib/store/cart-store";
import { NOMBRE_TIENDA } from "@/lib/products";

export function Header() {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const { totalUnidades } = useCartTotals();
  const anterior = useRef(totalUnidades);
  const [saltar, setSaltar] = useState(false);

  useEffect(() => {
    if (hasHydrated && totalUnidades > anterior.current) {
      setSaltar(true);
      const t = setTimeout(() => setSaltar(false), 500);
      anterior.current = totalUnidades;
      return () => clearTimeout(t);
    }
    anterior.current = totalUnidades;
  }, [totalUnidades, hasHydrated]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {NOMBRE_TIENDA}
          </span>
        </Link>

        <Link
          href="/carrito"
          aria-label={
            hasHydrated && totalUnidades > 0
              ? `Carrito, ${totalUnidades} producto${totalUnidades === 1 ? "" : "s"}`
              : "Carrito"
          }
          className="relative flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-brand hover:text-brand"
        >
          <motion.span
            animate={saltar ? { scale: [1, 1.35, 0.95, 1], rotate: [0, -12, 8, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <CartIcon className="h-5 w-5" />
          </motion.span>
          <span className="hidden sm:inline">Carrito</span>
          {hasHydrated && totalUnidades > 0 && (
            <motion.span
              key={totalUnidades}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-semibold text-white"
            >
              {totalUnidades > 9 ? "9+" : totalUnidades}
            </motion.span>
          )}
        </Link>
      </div>
    </header>
  );
}
