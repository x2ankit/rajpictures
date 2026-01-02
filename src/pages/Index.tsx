import { HeroSection } from "@/components/HeroSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import { GallerySection } from "@/components/GallerySection";
import { Testimonials } from "@/components/Testimonials";
import { AboutRaj } from "../components/AboutRaj";
import Services from "@/components/Services";
import { LensScrollSection } from "@/components/LensScrollSection";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import { SectionDivider } from "@/components/SectionDivider";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const Index = () => {
  return (
    <main className="relative">
      <section id="home">
        <HeroSection />
      </section>

      <div className="w-full py-20 relative z-10">
        <LensScrollSection />
      </div>

      <div className="w-full py-20 relative z-10">
        <section id="about">
          <AboutRaj />
        </section>
      </div>

      <div className="w-full py-20 relative z-10">
        <section id="services">
          <RevealOnScroll>
            <Services />
          </RevealOnScroll>
        </section>
      </div>

      <SectionDivider />

      <div className="w-full py-20 relative z-10">
        <RevealOnScroll>
          <Pricing />
        </RevealOnScroll>
      </div>

      <SectionDivider />

      <div className="w-full py-20 relative z-10">
        <section id="films">
          <RevealOnScroll>
            <YouTubeSection />
          </RevealOnScroll>
        </section>
      </div>

      <SectionDivider />

      <div className="w-full py-20 relative z-10">
        <section id="portfolio">
          <GallerySection />
        </section>
      </div>

      <div className="w-full py-20 relative z-10">
        <Testimonials />
      </div>

      <div className="w-full relative z-10">
        <Contact />
      </div>
    </main>
  );
};

export default Index;
