import { motion } from "framer-motion";
import { Baby, Camera, Heart } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 20 },
  },
};

export const ServiceCards = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-900/30 backdrop-blur-3xl border-y border-white/5">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <Reveal>
            <p className="text-amber-500 text-xs sm:text-sm uppercase tracking-[0.2em]">WHAT WE CREATE</p>
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <h2 className="font-serifDisplay text-5xl md:text-7xl leading-[1.02] text-white">
                Our <span className="text-amber-500">Services</span>
              </h2>
              <p className="font-body text-zinc-400 tracking-[0.08em] max-w-xl">
                Editorial coverage, cinematic motion, and intimate portraits — crafted with intention and elegance.
              </p>
            </div>
          </Reveal>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Big card */}
          <motion.a
            href="#portfolio"
            variants={item}
            className="group relative overflow-hidden border border-white/5 bg-gradient-to-br from-zinc-900 to-black p-8 md:col-span-2 md:row-span-2 transition-colors hover:bg-gradient-to-br hover:from-white/5 hover:to-white/0 hover:border-amber-500/30"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative">
              <Heart className="h-9 w-9 text-amber-500" />
              <div className="mt-6 font-serifDisplay text-4xl md:text-5xl text-white leading-tight">
                Wedding <span className="text-amber-500">Photography</span>
              </div>
              <p className="mt-4 font-body text-zinc-400 leading-relaxed max-w-xl">
                Full-day editorial coverage with cinematic light, crafted compositions, and timeless storytelling.
              </p>

              <div className="mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-[0.28em] font-montserrat text-white/80 group-hover:text-white transition-colors">
                View Portfolio <span aria-hidden>→</span>
              </div>
            </div>
          </motion.a>

          {/* Right top */}
          <motion.a
            href="#portfolio"
            variants={item}
            className="group border border-white/5 bg-zinc-950 p-7 transition-colors hover:bg-gradient-to-br hover:from-white/5 hover:to-white/0 hover:border-amber-500/30"
          >
            <Camera className="h-8 w-8 text-amber-500" />
            <div className="mt-5 font-serifDisplay text-2xl md:text-3xl text-white">
              Pre-Wedding <span className="text-amber-500">Shoots</span>
            </div>
            <p className="mt-3 font-body text-zinc-400 leading-relaxed">
              Romantic, cinematic sessions designed for natural emotion.
            </p>
          </motion.a>

          {/* Right bottom */}
          <motion.a
            href="#contact"
            variants={item}
            className="group border border-white/5 bg-zinc-950 p-7 transition-colors hover:bg-gradient-to-br hover:from-white/5 hover:to-white/0 hover:border-amber-500/30"
          >
            <Baby className="h-8 w-8 text-amber-500" />
            <div className="mt-5 font-serifDisplay text-2xl md:text-3xl text-white">
              Baby &amp; <span className="text-amber-500">Maternity</span>
            </div>
            <p className="mt-3 font-body text-zinc-400 leading-relaxed">
              Gentle portraits with warmth, grace, and subtle luxury.
            </p>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
