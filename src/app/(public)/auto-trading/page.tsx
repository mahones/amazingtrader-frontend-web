import { LicensePurchaseGrid } from "@/components/purchase/LicensePurchaseGrid";
import { getLicensePlans } from "@/lib/api/server";

export default async function AutoTradingPage() {
  const plans = await getLicensePlans().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Licences d&apos;auto-trading</h1>
        <p className="mt-3 text-muted-foreground">
          Choisissez la formule adaptée à votre capital et laissez nos stratégies
          automatisées travailler pour vous.
        </p>
      </div>

      <div className="mt-12">
        <LicensePurchaseGrid plans={plans} />
      </div>
    </div>
  );
}
