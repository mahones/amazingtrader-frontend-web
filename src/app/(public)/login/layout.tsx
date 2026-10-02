import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Connexion",
  description: "Connectez-vous à votre espace Amazing Traders pour accéder à vos formations, licences et bots.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
