import type { Page } from "@playwright/test";

export const ENVIO_VALIDO = {
  nombre: "Ada Lovelace",
  direccion: "Calle Mayor 12, 3º B",
  ciudad: "Madrid",
  codigoPostal: "28001",
  pais: "España",
};

export const TARJETA_VALIDA = {
  nombreTitular: "Ada Lovelace",
  // Número de test estándar (Luhn-válido), no es una tarjeta real.
  numero: "4111111111111111",
  caducidad: "1229",
  cvc: "123",
};

/** Añade el primer producto del catálogo `veces` veces. */
export async function añadirPrimerProducto(page: Page, veces = 1) {
  const boton = page.getByRole("button", { name: "Añadir al carrito" }).first();
  for (let i = 0; i < veces; i++) {
    await boton.click();
    // Espera a que el botón vuelva a su texto original antes de repetir el
    // click, evitando doble-submit sobre el estado "Añadido".
    if (i < veces - 1) {
      await page.getByRole("button", { name: "Añadir al carrito" }).first().waitFor();
    }
  }
}

/** Rellena y envía el paso 1 (envío) con datos válidos. */
export async function completarEnvio(page: Page, datos = ENVIO_VALIDO) {
  await page.getByLabel("Nombre completo").fill(datos.nombre);
  await page.getByLabel("Dirección").fill(datos.direccion);
  await page.getByLabel("Ciudad").fill(datos.ciudad);
  await page.getByLabel("Código postal").fill(datos.codigoPostal);
  await page.getByLabel("País").selectOption(datos.pais);
  await page.getByRole("button", { name: "Continuar al pago" }).click();
}

/** Rellena el paso 2 (pago) con una tarjeta válida, sin enviar. */
export async function rellenarPago(page: Page, datos = TARJETA_VALIDA) {
  await page.getByLabel("Nombre del titular").fill(datos.nombreTitular);
  await page.getByLabel("Número de tarjeta").fill(datos.numero);
  await page.getByLabel("Caducidad (MM/AA)").fill(datos.caducidad);
  await page.getByLabel("CVC").fill(datos.cvc);
}
