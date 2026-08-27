"use client";

import { MessageCircleMore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAdminGreeting, buildWhatsappUrl } from "@/lib/whatsapp";

export function WhatsappButton({
  name,
  whatsappNumber,
  variant = "labeled",
}: {
  name: string;
  whatsappNumber: string;
  variant?: "labeled" | "icon";
}) {
  const url = buildWhatsappUrl(whatsappNumber, buildAdminGreeting(name));

  if (variant === "icon") {
    return (
      <Button
        size="icon-sm"
        variant="ghost"
        aria-label={`Contacter ${name} sur WhatsApp`}
        className="text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]"
        render={
          <a href={url} target="_blank" rel="noopener noreferrer" title={`Contacter ${name} sur WhatsApp`} />
        }
      >
        <MessageCircleMore />
      </Button>
    );
  }

  return (
    <Button
      className="bg-[#25D366] text-white hover:bg-[#25D366]/90"
      render={<a href={url} target="_blank" rel="noopener noreferrer" />}
    >
      <MessageCircleMore />
      Message WhatsApp
    </Button>
  );
}
