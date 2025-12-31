import { motion } from "framer-motion";

const PORTRAIT_SRC = "/raj-portrait-placeholder.svg";

export const AboutRaj = () => {
  return (
    <section className="bg-black px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
            <img
              src={PORTRAIT_SRC}
              alt="Portrait of Raj"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
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

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="font-signature text-4xl text-white/85">Raj</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
