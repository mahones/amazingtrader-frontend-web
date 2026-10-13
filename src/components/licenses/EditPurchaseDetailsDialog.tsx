"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PostPurchaseDetailsForm } from "@/components/purchase/PostPurchaseDetailsForm";
import { toAccountList } from "@/lib/license-accounts";
import { toast } from "@/lib/toast";
import type { UserLicense } from "@/types/license";
import type { UserBotLicense } from "@/types/bot";

export function EditPurchaseDetailsDialog<T extends UserLicense | UserBotLicense>({
  type,
  license,
  onUpdated,
}: {
  type: T extends UserLicense ? "license_plan" : "bot_license_plan";
  license: T;
  onUpdated: (license: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const plan = "license_plan" in license ? license.license_plan : license.bot_license_plan;
  const numberOfAccounts = license.number_of_accounts ?? plan?.number_of_accounts ?? 1;

  function handleSubmitted(result: UserLicense | UserBotLicense) {
    if (result.pending_purchase_details) {
      toast.info("Votre demande a été envoyée et est en attente d'approbation par un administrateur.");
      // Only the pending fields changed — keep showing the still-live values.
      onUpdated({
        ...license,
        pending_purchase_details: result.pending_purchase_details,
        pending_purchase_details_submitted_at: result.pending_purchase_details_submitted_at,
      });
    } else {
      toast.success("Identifiants enregistrés.");
      onUpdated(result as T);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>Modifier mes identifiants</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mes identifiants</DialogTitle>
          <DialogDescription>
            Toute modification d&apos;identifiants déjà renseignés doit être validée par un administrateur
            avant de prendre effet.
          </DialogDescription>
        </DialogHeader>
        <PostPurchaseDetailsForm
          type={type as "license_plan" | "bot_license_plan"}
          licenseId={license.id}
          numberOfAccounts={numberOfAccounts}
          initialValues={toAccountList(license.purchase_details)}
          onSubmitted={handleSubmitted}
        />
      </DialogContent>
    </Dialog>
  );
}
