import type { SVGProps } from "react";
import type { CategoriaProducto } from "@/types";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Icono de marca NexoTech: dos nodos conectados (nexo = punto de unión). */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <defs>
        <linearGradient id="nexo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r="5" fill="url(#nexo-grad)" />
      <circle cx="23" cy="23" r="5" fill="url(#nexo-grad)" opacity="0.55" />
      <path
        d="M12.5 12.5 L19.5 19.5"
        stroke="url(#nexo-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AudioIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.3" />
      <rect x="17" y="14" width="4" height="6" rx="1.3" />
    </svg>
  );
}

export function TecladoIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="1.8" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h12" />
    </svg>
  );
}

export function RatonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="5" />
      <path d="M12 2.5v6" />
    </svg>
  );
}

export function CargaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M13 2 4.5 13.5H11L10.5 22 19.5 10.5H13Z" strokeLinejoin="round" />
    </svg>
  );
}

export function AltavozIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="3.5" />
      <circle cx="12" cy="9" r="2.6" />
      <circle cx="12" cy="16.5" r="1.2" />
    </svg>
  );
}

export function EnergiaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M21 10v4" />
      <path d="M7 10.5 10 12.5 7 14.5" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9.5" cy="21" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="m4 12.5 5 5L20 7" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<
  CategoriaProducto,
  (props: IconProps) => React.JSX.Element
> = {
  audio: AudioIcon,
  teclado: TecladoIcon,
  raton: RatonIcon,
  carga: CargaIcon,
  altavoz: AltavozIcon,
  energia: EnergiaIcon,
};
