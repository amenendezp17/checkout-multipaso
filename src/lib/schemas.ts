import { z } from "zod";
import { esLuhnValido } from "./format";

export const PAISES = [
  "España",
  "Portugal",
  "Francia",
  "Italia",
  "Alemania",
  "México",
  "Argentina",
] as const;

export const shippingSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(60, "El nombre es demasiado largo"),
  direccion: z
    .string()
    .trim()
    .min(5, "Introduce una dirección válida")
    .max(100, "La dirección es demasiado larga"),
  ciudad: z
    .string()
    .trim()
    .min(2, "Introduce una ciudad válida")
    .max(60, "La ciudad es demasiado larga"),
  codigoPostal: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{3,5}$/, "Código postal no válido"),
  pais: z.enum(PAISES, { message: "Selecciona un país" }),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;

export const paymentSchema = z.object({
  nombreTitular: z
    .string()
    .trim()
    .min(3, "Introduce el nombre tal como aparece en la tarjeta")
    .max(60, "El nombre es demasiado largo"),
  numeroTarjeta: z
    .string()
    .trim()
    .refine((v) => /^\d{4} \d{4} \d{4} \d{4}$/.test(v), {
      message: "Número de tarjeta no válido (16 dígitos)",
    })
    .refine((v) => esLuhnValido(v), {
      message: "Número de tarjeta no válido",
    }),
  caducidad: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA")
    .refine((v) => {
      const [mes, anio] = v.split("/").map(Number);
      const ahora = new Date();
      const anioActual = ahora.getFullYear() % 100;
      const mesActual = ahora.getMonth() + 1;
      if (anio < anioActual) return false;
      if (anio === anioActual && mes < mesActual) return false;
      return true;
    }, "La tarjeta está caducada"),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3}$/, "CVC no válido"),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
