import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abrirWhatsApp(telefoneDoBanco?: string) {
  // Número fixo para demonstração
  const numeroFixo = '5561996636081';
  const urlWhatsApp = `https://wa.me/${numeroFixo}`;

  // Abre em uma nova aba
  window.open(urlWhatsApp, '_blank');
}
