import path from "node:path";
import { chromium, type Browser } from "@playwright/test";
import { test as base, expect } from "@playwright/test";
import { playAudit } from "playwright-lighthouse";
import getPort from "get-port";
import { añadirPrimerProducto, completarEnvio, rellenarPago } from "./helpers";

// Lighthouse necesita hablar con Chrome vía CDP en un puerto de depuración
// remota: cada worker abre su propio browser con un puerto único.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- API de playwright-lighthouse
const lighthouseTest = base.extend<{}, { port: number; browser: Browser }>({
  port: [
    async ({}, use) => {
      await use(await getPort());
    },
    { scope: "worker" },
  ],
  browser: [
    async ({ port }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${port}`],
      });
      await use(browser);
      await browser.close();
    },
    { scope: "worker" },
  ],
});

// Umbrales fijados por debajo de los scores reales medidos (perf 95-100,
// a11y 94-95, best-practices/seo 100) para que el test detecte
// regresiones reales sin ser un sello de goma.
const THRESHOLDS = {
  performance: 85,
  accessibility: 95,
  "best-practices": 95,
  seo: 95,
} as const;

const REPORT_DIR = path.join(process.cwd(), "lighthouse-reports");

lighthouseTest.describe("Lighthouse", () => {
  lighthouseTest("catálogo (/)", async ({ browser, port, baseURL }) => {
    const page = await browser.newPage();
    await page.goto(`${baseURL}/`);
    await playAudit({
      page,
      port,
      thresholds: THRESHOLDS,
      reports: { formats: { html: true }, name: "catalogo", directory: REPORT_DIR },
    });
    await page.close();
  });

  lighthouseTest("carrito", async ({ browser, port, baseURL }) => {
    const page = await browser.newPage();
    await page.goto(`${baseURL}/`);
    await añadirPrimerProducto(page, 1);
    await page.goto(`${baseURL}/carrito`);
    await playAudit({
      page,
      port,
      thresholds: THRESHOLDS,
      reports: { formats: { html: true }, name: "carrito", directory: REPORT_DIR },
    });
    await page.close();
  });

  lighthouseTest("checkout — envío", async ({ browser, port, baseURL }) => {
    const page = await browser.newPage();
    await page.goto(`${baseURL}/`);
    await añadirPrimerProducto(page, 1);
    await page.goto(`${baseURL}/checkout/envio`);
    await playAudit({
      page,
      port,
      thresholds: THRESHOLDS,
      reports: { formats: { html: true }, name: "checkout-envio", directory: REPORT_DIR },
    });
    await page.close();
  });

  lighthouseTest("checkout — confirmación", async ({ browser, port, baseURL }) => {
    const page = await browser.newPage();
    await page.goto(`${baseURL}/`);
    await añadirPrimerProducto(page, 1);
    await page.goto(`${baseURL}/checkout/envio`);
    await completarEnvio(page);
    await rellenarPago(page);
    await page.getByRole("button", { name: /Confirmar pedido/ }).click();
    await expect(page).toHaveURL(`${baseURL}/checkout/confirmacion`, {
      timeout: 10_000,
    });
    await playAudit({
      page,
      port,
      thresholds: THRESHOLDS,
      reports: {
        formats: { html: true },
        name: "checkout-confirmacion",
        directory: REPORT_DIR,
      },
    });
    await page.close();
  });
});
