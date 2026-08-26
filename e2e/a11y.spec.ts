import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { añadirPrimerProducto, completarEnvio, rellenarPago } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

async function auditar(page: import("@playwright/test").Page) {
  // Tras una navegación cliente, <title> puede tardar un instante en
  // asentarse; esperarlo evita falsos positivos de "document-title".
  await expect(page).toHaveTitle(/NexoTech/);
  const resultados = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    resultados.violations,
    JSON.stringify(resultados.violations, null, 2)
  ).toEqual([]);
}

test.describe("WCAG 2.1 AA (axe-core)", () => {
  test("catálogo (/)", async ({ page }) => {
    await page.goto("/");
    await auditar(page);
  });

  test("carrito vacío", async ({ page }) => {
    await page.goto("/carrito");
    await auditar(page);
  });

  test("carrito con productos", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/carrito");
    await auditar(page);
  });

  test("checkout — paso 1: envío", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await expect(page.getByRole("heading", { name: "Dirección de envío" })).toBeVisible();
    await auditar(page);
  });

  test("checkout — paso 1: con errores de validación visibles", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await page.getByRole("button", { name: "Continuar al pago" }).click();
    // El texto "Selecciona un país" también aparece como <option> deshabilitada
    // del <select>; se acota al mensaje de error real.
    await expect(
      page.locator("span.text-danger", { hasText: "Selecciona un país" })
    ).toBeVisible();
    await auditar(page);
  });

  test("checkout — paso 2: pago", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);
    await expect(page.getByRole("heading", { name: "Pago" })).toBeVisible();
    await auditar(page);
  });

  test("checkout — paso 3: confirmación", async ({ page }) => {
    await page.goto("/");
    await añadirPrimerProducto(page, 1);
    await page.goto("/checkout/envio");
    await completarEnvio(page);
    await rellenarPago(page);
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await expect(page).toHaveURL("/checkout/confirmacion", { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "¡Pedido confirmado!" })).toBeVisible();
    await auditar(page);
  });
});
