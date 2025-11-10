import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abrirWhatsApp(telefoneDoBanco?: string) {
  if (!telefoneDoBanco) {
    console.error("Número de telefone não fornecido.");
    return;
  }

  // Remove todos os caracteres que não são dígitos
  const telefoneLimpo = telefoneDoBanco.replace(/\D/g, '');

  // Adiciona o código do país (Brasil)
  const codigoPais = '55';
  const urlWhatsApp = `https://wa.me/${codigoPais}${telefoneLimpo}`;

  // Abre em uma nova aba
  window.open(urlWhatsApp, '_blank');
}
