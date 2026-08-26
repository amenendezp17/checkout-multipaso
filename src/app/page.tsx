import { ProductCard } from "@/components/ProductCard";
import { CheckoutResetOnCatalog } from "@/components/CheckoutResetOnCatalog";
import { PRODUCTOS, NOMBRE_TIENDA } from "@/lib/products";

export default function CatalogoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CheckoutResetOnCatalog />
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Tecnología esencial, sin complicaciones.
        </h1>
        <p className="mt-3 text-muted">
          {NOMBRE_TIENDA} selecciona los accesorios que usas cada día:
          audio, teclado, carga y energía portátil.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTOS.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
