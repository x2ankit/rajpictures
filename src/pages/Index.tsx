import { HeroSection } from "@/components/HeroSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import { GallerySection } from "@/components/GallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Testimonials } from "@/components/Testimonials";
import { AboutRaj } from "@/components/AboutRaj";
import { ServiceCards } from "@/components/ServiceCards";
import { LensScrollSection } from "@/components/LensScrollSection";

const Index = () => {
  return (
    <main className="relative">
      <section id="home">
        <HeroSection />
      </section>
      <LensScrollSection />
      <section id="about">
        <AboutRaj />
      </section>
        <section id="services">
          <ServiceCards />
        </section>
      <section id="films">
        <YouTubeSection />
      </section>
      <section id="portfolio">
        <GallerySection />
      </section>
      <Testimonials />
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
};

export default Index;
