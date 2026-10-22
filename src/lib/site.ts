/** Canonical public origin (the apex domain 308-redirects to www on Vercel). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amazingtraders.net").replace(/\/$/, "");
