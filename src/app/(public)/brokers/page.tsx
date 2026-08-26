import { BrokerCard } from "@/components/cards/BrokerCard";
import { getBrokers } from "@/lib/api/server";

export default async function BrokersPage() {
  const brokers = await getBrokers().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Courtier <span className="text-primary">recommandés</span> 
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Ouvrez votre compte chez l&apos;un de nos courtiers recommandés
          pour connecter votre licence d&apos;auto-trading ou votre bot en
          toute simplicité.
        </p>
      </div>

      {brokers.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {brokers.map((broker) => (
            <BrokerCard key={broker.id} broker={broker} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          Aucun courtier partenaire pour le moment.
        </p>
      )}
    </div>
  );
}
