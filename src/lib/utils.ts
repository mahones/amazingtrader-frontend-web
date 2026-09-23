import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount)
}

// Partner-code screens display amounts in "points" instead of a currency symbol.
export function formatPartnerAmount(amount: number) {
  const formatted = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)
  return `${formatted} point${amount === 1 ? "" : "s"}`
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function formatDate(date: string | null) {
  if (!date) return "-"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(date))
}

export function formatDateTime(date: string | null) {
  if (!date) return "-"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date))
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function formatDuration(value: number, unit: "month" | "year") {
  if (unit === "year") return `${value} an${value > 1 ? "s" : ""}`
  return `${value} mois`
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "")
}
