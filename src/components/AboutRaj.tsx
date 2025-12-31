import { motion } from "framer-motion";

import photographerImage from "@/assets/photographer-profile.jpg";

const PORTRAIT_SRC = "/image_129164.jpg";

export const AboutRaj = () => {
  return (
    <section className="bg-black px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative flex justify-center md:justify-start"
        >
          <motion.div
            whileHover={{ y: -6, rotate: -0.4 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
            className="relative w-full max-w-[320px] sm:max-w-[360px]"
          >
            {/* Frame */}
            <div className="absolute -inset-3 rounded-xl border border-amber-500/35" />
            <div className="absolute -inset-1 rounded-xl border border-white/10" />

            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-950">
              <img
                src={PORTRAIT_SRC}
                alt="Portrait of Raj"
                className="h-full w-full object-cover grayscale-[15%]"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = photographerImage;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="min-w-0"
        >
          <p className="text-amber-500 text-xs uppercase tracking-[0.35em]">The Artist</p>
          <h2 className="mt-4 font-serifDisplay text-4xl md:text-5xl text-amber-500">
            Hi, I am Raj.
          </h2>
          <p className="mt-6 text-white/75 text-base md:text-lg leading-relaxed">
            I don&apos;t just click photos; I capture feelings. My portfolio is a collection of timeless moments,
            crafted with intention, light, and emotion — so your memories feel as cinematic as they truly were.
          </p>

          <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
            From intimate portraits to grand wedding films, I focus on honest expressions, elegant composition, and
            lighting that feels like a scene from a movie.
          </p>

          <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
            Based in Bhubaneswar, I work across India to create imagery that stays timeless — long after the day is
            over.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
