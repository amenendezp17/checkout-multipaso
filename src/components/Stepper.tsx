"use client";

import { usePathname } from "next/navigation";
import { CheckIcon } from "@/components/icons";

const PASOS = [
  { ruta: "/checkout/envio", label: "Envío" },
  { ruta: "/checkout/pago", label: "Pago" },
  { ruta: "/checkout/confirmacion", label: "Confirmación" },
] as const;

export function Stepper() {
  const pathname = usePathname();
  const indiceActual = PASOS.findIndex((p) => p.ruta === pathname);

  return (
    <ol className="mx-auto flex max-w-xl items-center justify-between px-4 py-8 sm:px-0">
      {PASOS.map((paso, i) => {
        const completado = i < indiceActual;
        const activo = i === indiceActual;
        return (
          <li key={paso.ruta} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                  completado
                    ? "border-brand bg-brand text-white"
                    : activo
                      ? "border-brand text-brand"
                      : "border-border text-muted"
                }`}
              >
                {completado ? <CheckIcon className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  activo || completado ? "text-foreground" : "text-muted"
                }`}
              >
                {paso.label}
              </span>
            </div>
            {i < PASOS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded transition ${
                  completado ? "bg-brand" : "bg-border"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
