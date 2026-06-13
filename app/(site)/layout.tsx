import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { DeskPets } from "@/components/ui/DeskPets";
import { SvgFilters } from "@/components/ui/SvgFilters";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SvgFilters />
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
      <DeskPets />
    </div>
  );
}
