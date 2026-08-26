/** Construye la URL de una foto de Unsplash al ancho pedido. */
export function unsplashUrl(imagenId: string, width: number): string {
  return `https://images.unsplash.com/${imagenId}?fm=jpg&q=75&w=${width}&auto=format&fit=crop`;
}

export function formatPrecio(valor: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(valor);
}

/** Reformatea "1234567890123456" -> "1234 5678 9012 3456" mientras se escribe, tope 16 dígitos. */
export function formatNumeroTarjeta(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 16);
  return digitos.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Reformatea "1225" -> "12/25" mientras se escribe. */
export function formatCaducidad(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 4);
  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
}

export function soloDigitos(valor: string, max: number): string {
  return valor.replace(/\D/g, "").slice(0, max);
}

/** Algoritmo de Luhn — valida el checksum del número de tarjeta. */
export function esLuhnValido(numero: string): boolean {
  const digitos = numero.replace(/\D/g, "");
  if (digitos.length < 13) return false;
  let suma = 0;
  let doblar = false;
  for (let i = digitos.length - 1; i >= 0; i--) {
    let d = parseInt(digitos[i], 10);
    if (doblar) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    suma += d;
    doblar = !doblar;
  }
  return suma % 10 === 0;
}

/** Genera un número de pedido ficticio, ej. "NX-83920-4471". */
export function generarNumeroPedido(): string {
  const bloque = () => Math.floor(1000 + Math.random() * 9000);
  return `NX-${bloque()}-${bloque()}`;
}
