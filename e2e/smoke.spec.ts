import { test, expect } from "@playwright/test";
import {
  añadirPrimerProducto,
  completarEnvio,
  rellenarPago,
  ENVIO_VALIDO,
} from "./helpers";

test.describe("camino feliz: catálogo → carrito → checkout → confirmación", () => {
  test("completa una compra de principio a fin", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Tecnología esencial"
    );

    await añadirPrimerProducto(page, 1);
    // Badge del carrito en el header sube a 1.
    await expect(page.getByRole("link", { name: /Carrito/ })).toContainText("1");

    await page.getByRole("link", { name: /Carrito/ }).click();
    await expect(page).toHaveURL("/carrito");
    await expect(page.getByRole("heading", { name: "Tu carrito" })).toBeVisible();

    await page.getByRole("link", { name: "Continuar" }).click();
    await expect(page).toHaveURL("/checkout/envio");

    await completarEnvio(page);
    await expect(page).toHaveURL("/checkout/pago");

    await rellenarPago(page);
    // El formateo automático agrupa el número de tarjeta de 4 en 4.
    await expect(page.getByLabel("Número de tarjeta")).toHaveValue(
      "4111 1111 1111 1111"
    );
    await expect(page.getByLabel("Caducidad (MM/AA)")).toHaveValue("12/29");

    const botonConfirmar = page.getByRole("button", { name: /Confirmar pedido/ });
    await botonConfirmar.click();

    // Loading state: botón deshabilitado con texto "Procesando..." mientras
    // se simula la latencia de red.
    await expect(page.getByRole("button", { name: "Procesando..." })).toBeDisabled();

    await expect(page).toHaveURL("/checkout/confirmacion", { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "¡Pedido confirmado!" })).toBeVisible();
    await expect(page.getByText(/NX-\d{4}-\d{4}/)).toBeVisible();
    await expect(page.getByText(ENVIO_VALIDO.nombre)).toBeVisible();
    await expect(page.getByText(ENVIO_VALIDO.ciudad, { exact: false })).toBeVisible();

    // Tras confirmar, el carrito quedó vacío.
    await page.getByRole("link", { name: "Volver al catálogo" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("link", { name: /Carrito/ })).not.toContainText(/[1-9]/);
  });
});

test.describe("carrito: cantidades y persistencia", () => {
  test("bajar cantidad a 0 elimina el producto del carrito", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.getByRole("link", { name: /Carrito/ }).click();

    await page.getByRole("button", { name: "Disminuir cantidad" }).click();
    await expect(page.getByText("Tu carrito está vacío")).toBeVisible();
  });

  test("el carrito persiste tras recargar la página", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 2);
    await expect(page.getByRole("link", { name: /Carrito/ })).toContainText("2");

    await page.reload();
    await expect(page.getByRole("link", { name: /Carrito/ })).toContainText("2");
  });

  test("el badge del carrito muestra 9+ al superar 9 unidades", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 10);
    await expect(page.getByRole("link", { name: /Carrito/ })).toContainText("9+");
    // El nombre accesible conserva la cantidad exacta aunque el badge se tope.
    await expect(page.getByRole("link", { name: "Carrito, 10 productos" })).toBeVisible();
  });
});

test.describe("guards de ruta (negativo)", () => {
  test("sin productos, /checkout/envio redirige a /carrito", async ({ page }) => {
    await page.goto("/checkout/envio");
    await expect(page).toHaveURL("/carrito");
  });

  test("con carrito pero sin paso 1, /checkout/pago redirige a /checkout/envio", async ({
    page,
  }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/pago");
    await expect(page).toHaveURL("/checkout/envio");
  });

  test("sin pedido confirmado, /checkout/confirmacion redirige a /carrito", async ({
    page,
  }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/confirmacion");
    await expect(page).toHaveURL("/carrito");
  });
});

test.describe("validación de formularios (negativo)", () => {
  test("paso 1: error en tiempo real al salir de un campo inválido", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");

    await page.getByLabel("Nombre completo").fill("ab");
    await page.getByLabel("Dirección").click(); // dispara el blur en "nombre"
    await expect(
      page.getByText("El nombre debe tener al menos 3 caracteres")
    ).toBeVisible();

    // No debe poder avanzar con el formulario incompleto.
    await page.getByRole("button", { name: "Continuar al pago" }).click();
    await expect(page).toHaveURL("/checkout/envio");
    // El texto "Selecciona un país" también aparece como <option> deshabilitada
    // del <select>; se acota al mensaje de error real.
    await expect(
      page.locator("span.text-danger", { hasText: "Selecciona un país" })
    ).toBeVisible();
  });

  test("paso 2: tarjeta con Luhn inválido y caducada son rechazadas", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);

    await page.getByLabel("Nombre del titular").fill("Ada Lovelace");
    await page.getByLabel("Número de tarjeta").fill("4111111111111112"); // Luhn inválido
    await page.getByLabel("Caducidad (MM/AA)").fill("0120"); // caducada
    await page.getByLabel("CVC").fill("12"); // incompleto, se queda en 2 dígitos
    await page.getByLabel("CVC").blur();

    await expect(page.getByText("Número de tarjeta no válido")).toBeVisible();
    await expect(page.getByText("La tarjeta está caducada")).toBeVisible();
    await expect(page.getByText("CVC no válido")).toBeVisible();

    // El envío queda bloqueado: seguimos en el paso 2.
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await expect(page).toHaveURL("/checkout/pago");
  });

  test("el número de tarjeta no admite más de 16 dígitos", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);

    await page.getByLabel("Número de tarjeta").fill("41111111111111119999");
    await expect(page.getByLabel("Número de tarjeta")).toHaveValue(
      "4111 1111 1111 1111"
    );
  });

  test("el CVC no admite más de 3 dígitos", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);

    await page.getByLabel("CVC").fill("12345");
    await expect(page.getByLabel("CVC")).toHaveValue("123");
  });

  test("el código postal no admite más de 5 caracteres", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");

    await page.getByLabel("Código postal").fill("2800123456");
    await expect(page.getByLabel("Código postal")).toHaveValue("28001");
  });

  test("atrás desde pago conserva los datos de envío", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);

    await page.getByRole("button", { name: "Atrás" }).click();
    await expect(page).toHaveURL("/checkout/envio");
    await expect(page.getByLabel("Nombre completo")).toHaveValue(ENVIO_VALIDO.nombre);
    await expect(page.getByLabel("Dirección")).toHaveValue(ENVIO_VALIDO.direccion);
  });
});
