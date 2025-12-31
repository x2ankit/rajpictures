import { motion } from "framer-motion";

const HERO_VIDEO_URL =
  "https://ftadonqbzirhllyufnjs.supabase.co/storage/v1/object/public/portfolio/hero/.%20(48).mp4";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl flex flex-col items-center text-center gap-6">
          <motion.h1
            className="font-serifDisplay text-amber-500 tracking-tight text-5xl sm:text-7xl md:text-8xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0.2, 1] }}
          >
            RAJ PHOTOGRAPHY
          </motion.h1>

          <motion.p
            className="font-body text-white/90 text-sm sm:text-base md:text-lg tracking-[0.25em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.2, 0, 0.2, 1] }}
          >
            Cinematic Visuals &amp; Storytelling
          </motion.p>
        </div>
      </div>
    </section>
  );
};
