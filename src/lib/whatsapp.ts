/**
 * Strips a stored "whatsapp_number" value (e.g. "+225 0102030405") down to
 * digits only, as required by the wa.me URL scheme.
 */
export function toWhatsappDigits(whatsappNumber: string): string {
  return whatsappNumber.replace(/\D/g, "");
}

/**
 * Builds a wa.me deep link to a user's own WhatsApp number, with an optional
 * pre-filled, URL-encoded message.
 */
export function buildWhatsappUrl(whatsappNumber: string, message?: string): string {
  const digits = toWhatsappDigits(whatsappNumber);
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Generic, professional French greeting used by the admin "Message WhatsApp" action. */
export function buildAdminGreeting(name: string): string {
  return `Bonjour ${name}, ici l'équipe amazingtraders. Nous revenons vers vous concernant votre compte, n'hésitez pas à nous répondre ici.`;
}
