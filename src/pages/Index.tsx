import { HeroSection } from "@/components/HeroSection";
import { YouTubeSection } from "@/components/YouTubeSection";
import Portfolio from "@/components/Portfolio";
import { Testimonials } from "@/components/Testimonials";
import { AboutRaj } from "../components/AboutRaj";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import { SectionDivider } from "@/components/SectionDivider";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Seo } from "@/components/Seo";

const Index = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Raj Pictures",
    url: "https://www.rajpictures.in",
    logo: "https://www.rajpictures.in/og-image.jpg",
    telephone: "+919337564186",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bonaigarh",
      addressRegion: "Odisha",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/raj_pictures_cinematic",
      "https://www.youtube.com/@rajpictures",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+919337564186",
      areaServed: ["Bonaigarh", "Deogarh", "Odisha", "India"],
      availableLanguage: ["English", "Odia", "Hindi"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Raj Pictures",
    url: "https://www.rajpictures.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.rajpictures.in/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Seo
        title="Wedding Photography, Films & Pre-Wedding Shoots in Odisha"
        description="Award-winning wedding photography and cinematic films in Odisha with a local focus on Bonaigarh and Deogarh (Debagarh). Raj Pictures crafts luxe storytelling, candid portraits, and pre-wedding shoots across Eastern India."
        pathname="/"
        type="website"
        keywords={[
          "Bonaigarh photography",
          "Raj Pictures",
          "Raj Photography",
          "best wedding photographer in Deogarh",
          "Debagarh wedding photographer",
          "Bonaigarh wedding photographer",
          "Odisha wedding films",
          "Rajpictures",
        ]}
        schema={[organizationSchema, websiteSchema]}
      />

      <main className="relative">
        <section id="home">
          <HeroSection />
        </section>

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
            <Portfolio />
          </section>
        </div>

        <div className="w-full py-20 relative z-10">
          <Testimonials />
        </div>

        <div className="w-full relative z-10">
          <Contact />
        </div>
      </main>
    </>
  );
};

export default Index;
