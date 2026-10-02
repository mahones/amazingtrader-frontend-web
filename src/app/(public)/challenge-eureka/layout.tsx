import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Challenge Eureka",
  description: "Relevez le Challenge Eureka : des stratégies de trading gérées, des licences et un accompagnement pour atteindre vos objectifs.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
