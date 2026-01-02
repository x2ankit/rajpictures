import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useScroll, useTransform } from "framer-motion";
import heroPoster from "@/assets/photographer-profile.jpg";

const HERO_VIDEO_URL =
  "https://ftadonqbzirhllyufnjs.supabase.co/storage/v1/object/public/portfolio/hero/finalhero.mp4";

export const HeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen h-[100dvh] overflow-hidden">
      {/* Fallback image (shows immediately if video can't autoplay/load) */}
      <img
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        src={heroPoster}
        alt=""
        loading="eager"
        decoding="async"
      />

      {/* Background video (mobile-safe attributes enabled) */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroPoster}
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex items-center px-6 md:px-12 lg:px-24 z-20">
        {isMobile ? <HeroStaticContent /> : <HeroScrollParallaxContent />}
      </div>

      {/* Scroll to Focus */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div className="relative h-20 w-20 md:h-24 md:w-24">
          <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-500 text-xl leading-none animate-bounce" aria-hidden>
              ↓
            </span>
          </div>
        </div>
        <div className="mt-4 text-[10px] font-mono tracking-widest text-amber-500">
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
};

const HeroCopy = () => {
  return (
    <>
      <div className="font-montserrat text-xs sm:text-sm uppercase tracking-[0.3em] text-zinc-300">
        PREMIUM WEDDING PHOTOGRAPHY &amp; FILMS
      </div>

      <h1 className="mt-6 font-serifDisplay font-extrabold leading-none">
        <span className="block bg-gradient-to-r from-yellow-200 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.4)] text-6xl md:text-[9rem]">
          RAJ
        </span>
        <span className="block text-white drop-shadow-lg text-6xl md:text-[9rem]">
          PICTURES
        </span>
      </h1>

      <p className="mt-6 font-body text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
        Capturing timeless moments with artistry and elegance.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-start gap-6">
        <a
          href="#gallery"
          className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white text-xs sm:text-sm uppercase tracking-[0.28em] font-montserrat rounded-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 hover:bg-white hover:text-black"
        >
          VIEW PORTFOLIO
        </a>

        <a
          href="#pricing"
          className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-black font-bold text-xs sm:text-sm uppercase tracking-[0.28em] font-montserrat rounded-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 hover:bg-amber-600"
        >
          BOOK A SESSION
        </a>
      </div>
    </>
  );
};

const HeroStaticContent = () => {
  return (
    <div className="max-w-3xl flex flex-col items-start text-left">
      <HeroCopy />
    </div>
  );
};

const HeroScrollParallaxContent = () => {
  const { scrollY } = useScroll();
  const zoomScale = useTransform(scrollY, [0, 220], [1, 1.1]);
  const zoomOpacity = useTransform(scrollY, [0, 140], [1, 0]);

  return (
    <motion.div
      style={{ scale: zoomScale, opacity: zoomOpacity }}
      className="max-w-3xl flex flex-col items-start text-left"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
    >
      <HeroCopy />
    </motion.div>
  );
};
