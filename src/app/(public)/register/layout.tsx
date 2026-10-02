import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Créer un compte",
  description: "Créez votre compte Amazing Traders gratuitement et accédez à nos formations, licences d'auto-trading et bots de trading.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
