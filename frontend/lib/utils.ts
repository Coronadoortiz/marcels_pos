// lib/utils.ts (o donde tengas tu archivo utils)
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Función para manejar clases de CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear moneda (Añadida aquí mismo)
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}