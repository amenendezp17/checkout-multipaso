# NexoTech — Checkout Multi-paso

Demo de portfolio: flujo de compra completo (catálogo → carrito → checkout
en 3 pasos → confirmación) en Next.js 16 (App Router) + TypeScript +
Tailwind CSS. 

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (`persist` para el carrito)
- React Hook Form + Zod (`@hookform/resolvers`)
- Framer Motion (transiciones entre pasos)

## Arrancar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Probar el flujo completo

1. **Catálogo** (`/`) — añade 1-2 productos con "Añadir al carrito". El
   contador del icono de carrito en el header sube.
2. **Persistencia** — recarga la página (F5). El contador del carrito no
   se pierde (guardado en `localStorage`).
3. **Carrito** (`/carrito`) — ajusta cantidades con +/−, elimina algún
   producto, comprueba que el subtotal se recalcula. Pulsa "Continuar".
4. **Guard de ruta** — intenta ir directo a `/checkout/pago` escribiendo
   la URL a mano: te redirige a `/checkout/envio` porque el paso 1 no
   está completo todavía.
5. **Paso 1: Envío** — deja un campo vacío y sal de él (`onBlur`): debe
   aparecer el error al instante, sin necesidad de enviar el formulario.
   Rellena todos los campos y pulsa "Continuar al pago".
6. **Paso 2: Pago** — escribe el número de tarjeta y comprueba que se
   formatea solo en grupos de 4 (`1234 5678 9012 3456`). Prueba una
   tarjeta caducada (`01/20`) o un número inválido para ver la
   validación (incluye chequeo Luhn). Usa una tarjeta de prueba válida,
   ej. `4111 1111 1111 1111`, caducidad futura (`12/28`) y CVC `123`.
7. **Botón "Atrás"** — vuelve al paso 1 desde el paso 2: los datos que
   ya habías escrito siguen ahí.
8. **Confirmar pedido** — al enviar el pago verás el botón en estado de
   carga (~1.5s simulando red) antes de redirigir a la confirmación.
9. **Confirmación** (`/checkout/confirmacion`) — verás el número de
   pedido generado, el resumen de productos, el total y la dirección de
   envío. El carrito ya está vacío en este punto (es intencional).
10. **Vuelta al catálogo** — si intentas entrar de nuevo a cualquier
    paso del checkout sin productos en el carrito, te redirige a
    `/carrito`.

## Tests automatizados

Playwright + axe-core + Lighthouse, contra un build de producción
(`next build && next start`, arrancado automáticamente por Playwright en
`localhost:3100`).

```bash
npx playwright install chromium   # una vez
npm run test:e2e                  # smoke (camino feliz + negativos) + WCAG 2.1 AA
npm run test:lighthouse           # performance / a11y / best-practices / SEO
npm run test:e2e:all              # los tres suites juntos
```

- **`e2e/smoke.spec.ts`** — camino feliz completo (catálogo → carrito →
  checkout → confirmación) y casos negativos: guards de ruta sin
  carrito/sin paso 1/sin pedido, validación de formularios (campo corto,
  Luhn inválido, tarjeta caducada, tope de dígitos), persistencia del
  carrito tras recargar, "Atrás" conserva datos.
- **`e2e/a11y.spec.ts`** — auditoría axe-core (WCAG 2.1 A/AA) en cada
  página clave, incluida la del formulario con errores visibles.
- **`e2e/lighthouse.spec.ts`** — performance/accessibility/best-practices/SEO
  por página, con umbrales por debajo de los scores reales medidos
  (perf ≥85, resto ≥95) para que falle ante una regresión real. Genera
  reportes HTML en `lighthouse-reports/` (no versionado).

## Notas

- El pago es 100% simulado — no hay pasarela real ni cobro.
- Los productos están hardcodeados en [src/lib/products.ts](src/lib/products.ts)
  (sin base de datos: es una demo de portfolio, no aporta valor real aquí).
