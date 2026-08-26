"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/FormField";
import { PAISES, shippingSchema, type ShippingFormValues } from "@/lib/schemas";
import { useCheckoutStore } from "@/lib/store/checkout-store";

export default function EnvioPage() {
  const router = useRouter();
  const envioGuardado = useCheckoutStore((s) => s.envio);
  const setEnvio = useCheckoutStore((s) => s.setEnvio);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: "onBlur",
    defaultValues: envioGuardado ?? {
      nombre: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      pais: undefined as unknown as ShippingFormValues["pais"],
    },
  });

  function onSubmit(data: ShippingFormValues) {
    setEnvio(data);
    router.push("/checkout/pago");
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-foreground">
        Dirección de envío
      </h1>
      <p className="mb-6 text-sm text-muted">
        ¿Dónde quieres recibir tu pedido?
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          label="Nombre completo"
          placeholder="Ada Lovelace"
          registration={register("nombre")}
          error={errors.nombre?.message}
        />
        <FormField
          label="Dirección"
          placeholder="Calle Mayor 12, 3º B"
          registration={register("direccion")}
          error={errors.direccion?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Ciudad"
            placeholder="Madrid"
            registration={register("ciudad")}
            error={errors.ciudad?.message}
          />
          <FormField
            label="Código postal"
            placeholder="28001"
            maxLength={5}
            registration={register("codigoPostal")}
            error={errors.codigoPostal?.message}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">País</span>
          <select
            {...register("pais")}
            defaultValue=""
            aria-invalid={!!errors.pais}
            className={`rounded-xl border px-3.5 py-2.5 text-foreground outline-none transition focus:ring-2 ${
              errors.pais
                ? "border-danger bg-danger/5 focus:border-danger focus:ring-danger/30"
                : "border-border bg-surface focus:border-brand focus:ring-brand/30"
            }`}
          >
            <option value="" disabled>
              Selecciona un país
            </option>
            {PAISES.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
          {errors.pais && (
            <span className="text-xs font-medium text-danger">
              {errors.pais.message}
            </span>
          )}
        </label>

        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/carrito")}
            className="rounded-full border border-border px-6 py-2.5 font-medium text-foreground transition hover:border-brand hover:text-brand"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition hover:bg-brand-dark"
          >
            Continuar al pago
          </button>
        </div>
      </form>
    </div>
  );
}
