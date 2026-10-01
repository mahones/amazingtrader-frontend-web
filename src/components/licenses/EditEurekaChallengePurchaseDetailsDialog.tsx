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
import { EurekaChallengePostPurchaseDetailsForm } from "@/components/purchase/EurekaChallengePostPurchaseDetailsForm";
import { toast } from "@/lib/toast";
import type { UserEurekaChallengeLicense } from "@/types/eurekaChallenge";

export function EditEurekaChallengePurchaseDetailsDialog({
  license,
  onUpdated,
}: {
  license: UserEurekaChallengeLicense;
  onUpdated: (license: UserEurekaChallengeLicense) => void;
}) {
  const [open, setOpen] = useState(false);
  const numberOfAccounts = license.number_of_accounts ?? license.eureka_challenge_license_plan.number_of_accounts;

  function handleSubmitted(result: UserEurekaChallengeLicense) {
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
        <EurekaChallengePostPurchaseDetailsForm
          licenseId={license.id}
          numberOfAccounts={numberOfAccounts}
          initialValues={license.purchase_details ?? undefined}
          onSubmitted={handleSubmitted}
        />
      </DialogContent>
    </Dialog>
  );
}
