import { motion, useScroll, useTransform } from "framer-motion";

const HERO_VIDEO_URL =
  "https://ftadonqbzirhllyufnjs.supabase.co/storage/v1/object/public/portfolio/hero/finalhero.mp4";

export const HeroSection = () => {
  const { scrollY } = useScroll();
  const zoomScale = useTransform(scrollY, [0, 220], [1, 1.1]);
  const zoomOpacity = useTransform(scrollY, [0, 140], [1, 0]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-start px-6">
        <div className="w-full">
          <motion.div
            style={{ scale: zoomScale, opacity: zoomOpacity }}
            className="max-w-3xl ml-4 md:ml-8 lg:ml-16 text-left items-start"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
          >
            <div className="font-montserrat text-xs sm:text-sm uppercase tracking-[0.3em] text-zinc-300">
              PREMIUM WEDDING PHOTOGRAPHY &amp; FILMS
            </div>

            <h1 className="mt-6 font-serifDisplay font-extrabold leading-none">
              <span className="block text-white drop-shadow-lg text-6xl md:text-[9rem]">
                Raj
              </span>
              <span className="block bg-gradient-to-r from-yellow-200 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.4)] text-6xl md:text-[9rem]">
                Pictures
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
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-500 text-black font-bold text-xs sm:text-sm uppercase tracking-[0.28em] font-montserrat rounded-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 hover:bg-amber-600"
              >
                BOOK A SESSION
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
