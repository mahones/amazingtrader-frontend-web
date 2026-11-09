import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function EntryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <TopBar />
        <Header />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12">{children}</main>
      <Footer />
    </>
  );
}
