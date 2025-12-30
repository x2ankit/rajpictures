import { ViewfinderOverlay } from "@/components/ViewfinderOverlay";
import { HeroSection } from "@/components/HeroSection";
import { ServicesGrid } from "@/components/ServicesGrid";
import { YouTubeSection } from "@/components/YouTubeSection";
import { AccordionSection } from "@/components/AccordionSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <ViewfinderOverlay />
      <HeroSection />
      <ServicesGrid />
      <YouTubeSection />
      <GallerySection />
      <AccordionSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
