import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContactButton } from "@/components/layout/FloatingContactButton";
import { TopBar } from "@/components/layout/TopBar";
import { WhatsappChannelPopup } from "@/components/marketing/WhatsappChannelPopup";
import { AnnouncementsBanner } from "@/components/announcements/AnnouncementsBanner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <TopBar />
        <Header />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <AnnouncementsBanner />
      </div>

      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappChannelPopup />
      <FloatingContactButton />
    </>
  );
}
