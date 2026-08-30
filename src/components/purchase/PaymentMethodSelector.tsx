"use client";

import { Bitcoin, CreditCard, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckoutPaymentMethod = "paypal" | "payerurl" | "moneyfusion";

const METHODS: {
  value: CheckoutPaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
  disabled?: boolean;
}[] = [
  { value: "paypal", label: "PayPal", description: "Carte bancaire ou solde PayPal", icon: CreditCard },
  { value: "payerurl", label: "PayerURL", description: "Paiement en cryptomonnaie", icon: Bitcoin },
  {
    value: "moneyfusion",
    label: "MoneyFusion",
    description: "Mobile money",
    icon: Smartphone,
    disabled: true,
  },
];

export function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: CheckoutPaymentMethod | null;
  onChange: (method: CheckoutPaymentMethod) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Moyen de paiement" className="grid gap-3 sm:grid-cols-3">
      {METHODS.map(({ value: methodValue, label, description, icon: Icon, disabled }) => {
        const selected = value === methodValue;
        return (
          <button
            key={methodValue}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onChange(methodValue)}
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
              disabled
                ? "cursor-not-allowed border-border opacity-50"
                : selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            {disabled && (
              <span className="absolute right-2 top-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Bientôt disponible
              </span>
            )}
            <Icon className={cn("size-6", selected ? "text-primary" : "text-muted-foreground")} />
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
