import { ViewfinderOverlay } from "@/components/ViewfinderOverlay";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import { AccordionSection } from "@/components/AccordionSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Testimonials } from "@/components/Testimonials";

const Index = () => {
  return (
    <main className="relative">
      <ViewfinderOverlay />
      <section id="home">
        <HeroSection />
      </section>
      <section id="services">
        <ServicesSection />
      </section>
      <section id="films">
        <YouTubeSection />
      </section>
      <section id="portfolio">
        <GallerySection />
      </section>
      <section id="about">
        <AccordionSection />
      </section>
      <Testimonials />
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
};

export default Index;
