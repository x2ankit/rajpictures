import { motion } from "framer-motion";

import photographerImage from "@/assets/photographer-profile.jpg";

const PORTRAIT_SRC = "/image_129164.jpg";

export const AboutRaj = () => {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-black to-black">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"
      />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Left: Portrait + stats */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.0, ease: [0.2, 0, 0.2, 1] }}
          className="flex flex-col items-center lg:items-start"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0.2, 1] }}
            className="w-full max-w-[520px]"
          >
            <div className="border border-amber-500/30 p-4">
              <div className="relative overflow-hidden bg-zinc-950">
                <div className="relative aspect-[4/5] w-full">
                  <img
                    src={PORTRAIT_SRC}
                    alt="Portrait of Raj"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = photographerImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5">
                    <div className="text-amber-500 text-[10px] uppercase tracking-[0.35em]">
                      FOUNDER &amp; LEAD PHOTOGRAPHER
                    </div>
                    <div className="mt-1 font-serifDisplay text-3xl text-amber-500">Raj</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "WEDDINGS" },
                { value: "10+", label: "YEARS" },
                { value: "1000+", label: "COUPLES" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/10 bg-white/5 px-3 py-4 text-center"
                >
                  <div className="font-serifDisplay text-2xl text-amber-500">{stat.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.32em] text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Biography */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.0, ease: [0.2, 0, 0.2, 1], delay: 0.05 }}
          className="min-w-0 flex flex-col justify-center"
        >
          <div className="mb-8">
            <span className="block text-amber-500 uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-6">
              About Raj Photography
            </span>
            <h2 className="font-serifDisplay text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white">
              A Decade of <br className="hidden md:block" />
              <span className="text-amber-500">Visual Artistry</span>
            </h2>
          </div>

          <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed">
            I&apos;m Raj, founder and lead photographer. With over 10 years of experience capturing life&apos;s most
            precious moments, I believe every frame should tell a story that resonates with emotion and
            authenticity.
          </p>

          <p className="mt-5 text-white/65 text-base md:text-lg leading-relaxed">
            From intimate ceremonies to grand celebrations, my team and I are dedicated to transforming fleeting
            moments into timeless memories. We blend traditional artistry with modern techniques to create
            photographs that stand the test of time.
          </p>

          <motion.a
            href="#portfolio"
            className="mt-10 inline-flex w-fit items-center gap-3 text-amber-500 text-xs uppercase tracking-[0.35em]"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.35, ease: [0.2, 0, 0.2, 1] }}
          >
            LEARN MORE ABOUT US <span aria-hidden>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
