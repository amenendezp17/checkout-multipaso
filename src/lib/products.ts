import type { Producto } from "@/types";

export const NOMBRE_TIENDA = "NexoTech";

export const PRODUCTOS: Producto[] = [
  {
    id: "nexo-pods-pro",
    nombre: "NexoPods Pro",
    descripcion: "Auriculares inalámbricos con cancelación activa de ruido.",
    precio: 89.99,
    categoria: "audio",
    imagenId: "photo-1572569979132-b4f10c9ec185",
    destacado: true,
  },
  {
    id: "nexo-type-rgb",
    nombre: "NexoType RGB",
    descripcion: "Teclado mecánico compacto, switches táctiles, retroiluminado.",
    precio: 79.99,
    categoria: "teclado",
    imagenId: "photo-1756694938645-9e3d829b0f28",
  },
  {
    id: "nexo-click",
    nombre: "NexoClick",
    descripcion: "Ratón inalámbrico ergonómico, sensor de alta precisión.",
    precio: 39.99,
    categoria: "raton",
    imagenId: "photo-1618176729090-253077a8f948",
  },
  {
    id: "nexo-charge-65",
    nombre: "NexoCharge 65W",
    descripcion: "Cargador rápido USB-C, compatible con portátil y móvil.",
    precio: 34.99,
    categoria: "carga",
    imagenId: "photo-1586254116951-5263e2cdb44c",
  },
  {
    id: "nexo-sound-mini",
    nombre: "NexoSound Mini",
    descripcion: "Altavoz Bluetooth portátil, resistente al agua (IPX6).",
    precio: 49.99,
    categoria: "altavoz",
    imagenId: "photo-1594501432907-91214bfdd928",
    destacado: true,
  },
  {
    id: "nexo-volt-20k",
    nombre: "NexoVolt 20000",
    descripcion: "Batería externa 20.000 mAh, carga rápida bidireccional.",
    precio: 44.99,
    categoria: "energia",
    imagenId: "photo-1566554738544-d962991c3fee",
  },
];

export function buscarProducto(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}
