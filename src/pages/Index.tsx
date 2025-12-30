import { ViewfinderOverlay } from "@/components/ViewfinderOverlay";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import { AccordionSection } from "@/components/AccordionSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="relative">
      <ViewfinderOverlay />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <YouTubeSection />
      <GallerySection />
      <AccordionSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default Index;
