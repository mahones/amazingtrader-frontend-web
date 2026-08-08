import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)
}

export function formatDate(date: string | null) {
  if (!date) return "-"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}
