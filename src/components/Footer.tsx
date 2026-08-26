import { NOMBRE_TIENDA } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted sm:px-6">
        <p>
          {NOMBRE_TIENDA} — demo de portfolio. Ningún pago es real; el
          checkout funciona en modo simulado.
        </p>
      </div>
    </footer>
  );
}
