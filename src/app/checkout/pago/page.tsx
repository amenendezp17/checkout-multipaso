"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/FormField";
import { LockIcon } from "@/components/icons";
import { paymentSchema, type PaymentFormValues } from "@/lib/schemas";
import {
  formatCaducidad,
  formatNumeroTarjeta,
  generarNumeroPedido,
  soloDigitos,
} from "@/lib/format";
import { useCheckoutStore } from "@/lib/store/checkout-store";
import { useCartStore, useCartTotals } from "@/lib/store/cart-store";

export default function PagoPage() {
  const router = useRouter();
  const envioCompletado = useCheckoutStore((s) => s.envioCompletado);
  const setPedidoConfirmado = useCheckoutStore((s) => s.setPedidoConfirmado);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { subtotal } = useCartTotals();
  const [enviando, setEnviando] = useState(false);

  // Guard de ruta: sin el paso 1 completo no se puede pagar.
  useEffect(() => {
    if (!envioCompletado) router.replace("/checkout/envio");
  }, [envioCompletado, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onBlur",
    defaultValues: { nombreTitular: "", numeroTarjeta: "", caducidad: "", cvc: "" },
  });

  async function onSubmit() {
    setEnviando(true);
    // Simula latencia de red del cobro (modo demo, sin cobro real).
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPedidoConfirmado({ numeroPedido: generarNumeroPedido(), items, subtotal });
    clearCart();
    router.push("/checkout/confirmacion");
  }

  if (!envioCompletado) return null;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">Pago</h1>
      <p className="mb-6 flex items-center gap-1.5 text-sm text-muted">
        <LockIcon className="h-4 w-4" /> Simulado — no se realiza ningún cobro real.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="Nombre del titular"
          placeholder="Ada Lovelace"
          autoComplete="off"
          registration={register("nombreTitular")}
          error={errors.nombreTitular?.message}
        />
        <FormField
          label="Número de tarjeta"
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          maxLength={19}
          autoComplete="off"
          registration={register("numeroTarjeta")}
          onChange={(e) =>
            setValue("numeroTarjeta", formatNumeroTarjeta(e.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={errors.numeroTarjeta?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Caducidad (MM/AA)"
            placeholder="12/28"
            inputMode="numeric"
            maxLength={5}
            autoComplete="off"
            registration={register("caducidad")}
            onChange={(e) =>
              setValue("caducidad", formatCaducidad(e.target.value), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.caducidad?.message}
          />
          <FormField
            label="CVC"
            placeholder="123"
            inputMode="numeric"
            maxLength={3}
            autoComplete="off"
            registration={register("cvc")}
            onChange={(e) =>
              setValue("cvc", soloDigitos(e.target.value, 3), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={errors.cvc?.message}
          />
        </div>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/checkout/envio")}
            disabled={enviando}
            className="rounded-full border border-border px-6 py-2.5 font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
          >
            Atrás
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-70"
          >
            {enviando && (
              <span className="h-4 w-4 animate-spin-slow rounded-full border-2 border-white/40 border-t-white" />
            )}
            {enviando ? "Procesando..." : "Confirmar pedido"}
          </button>
        </div>
      </form>
    </div>
  );
}
