"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, X } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/22879920432";
const CONTACT_EMAIL = "info@amazingtraders.net";

export function FloatingContactButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-72 rounded-2xl border border-border/60 bg-popover p-4 text-popover-foreground shadow-2xl shadow-black/20 ring-1 ring-foreground/10"
          >
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Besoin d&apos;aide ?
            </p>

            <div className="mt-3 space-y-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-[#25D366]/25 bg-[#25D366]/10 p-3 transition-colors hover:bg-[#25D366]/15"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">WhatsApp</span>
                  <span className="block text-xs text-muted-foreground">Réponse rapide</span>
                </span>
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 p-3 transition-colors hover:bg-primary/15"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Mail className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">Email</span>
                  <span className="block truncate text-xs text-muted-foreground">{CONTACT_EMAIL}</span>
                </span>
              </a>
            </div>

            <p className="mt-3 text-center text-xs font-medium text-[#25D366]">Réponse en moins de 5 min</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center gap-1.5">
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fermer le contact" : "Nous contacter"}
          whileTap={{ scale: 0.94 }}
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-105"
        >
          {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        </motion.button>
        {!open && (
          <span className="rounded-full border border-border/50 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
            Nous contacter
          </span>
        )}
      </div>
    </div>
  );
}
