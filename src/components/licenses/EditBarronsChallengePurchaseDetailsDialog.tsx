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
import { BarronsChallengePostPurchaseDetailsForm } from "@/components/purchase/BarronsChallengePostPurchaseDetailsForm";
import { toast } from "@/lib/toast";
import type { UserBarronsChallengeLicense } from "@/types/barronsChallenge";

export function EditBarronsChallengePurchaseDetailsDialog({
  license,
  onUpdated,
}: {
  license: UserBarronsChallengeLicense;
  onUpdated: (license: UserBarronsChallengeLicense) => void;
}) {
  const [open, setOpen] = useState(false);
  const numberOfAccounts = license.number_of_accounts ?? license.barrons_challenge_license_plan.number_of_accounts;

  function handleSubmitted(result: UserBarronsChallengeLicense) {
    if (result.pending_purchase_details) {
      toast.info("Votre demande a été envoyée et est en attente d'approbation par un administrateur.");
      onUpdated({
        ...license,
        pending_purchase_details: result.pending_purchase_details,
        pending_purchase_details_submitted_at: result.pending_purchase_details_submitted_at,
      });
    } else {
      toast.success("Identifiants enregistrés.");
      onUpdated(result);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>Modifier mes identifiants</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier mes identifiants</DialogTitle>
          <DialogDescription>
            Toute modification d&apos;identifiants déjà renseignés doit être validée par un administrateur
            avant de prendre effet.
          </DialogDescription>
        </DialogHeader>
        <BarronsChallengePostPurchaseDetailsForm
          licenseId={license.id}
          numberOfAccounts={numberOfAccounts}
          initialValues={license.purchase_details ?? undefined}
          onSubmitted={handleSubmitted}
        />
      </DialogContent>
    </Dialog>
  );
}
