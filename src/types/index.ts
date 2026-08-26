export type CategoriaProducto =
  | "audio"
  | "teclado"
  | "raton"
  | "carga"
  | "altavoz"
  | "energia";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaProducto;
  /** ID de foto en Unsplash (fotografía real del tipo de producto). */
  imagenId: string;
  destacado?: boolean;
}

export interface CartItem {
  productoId: string;
  cantidad: number;
}
