import { Reveal } from "@/components/Reveal";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 20 },
  },
};

function Feature({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3 text-sm md:text-base text-zinc-300">
      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
        <Check className="h-4 w-4 text-amber-500" />
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative w-full bg-transparent"
    >
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-12 lg:px-24">
        <Reveal className="text-center">
          <div className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-500 font-body">
            WEDDING PACKAGES
          </div>
          <h2 className="mt-5 font-serifDisplay text-4xl md:text-5xl text-amber-500">
            Choose Your Collection
          </h2>
          <p className="mt-5 text-base md:text-lg text-zinc-400 font-body tracking-wide max-w-3xl mx-auto">
            Premium coverage, cinematic storytelling, and handcrafted albums.
          </p>
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <motion.div
            variants={item}
            className="relative flex flex-col h-full rounded-2xl bg-transparent border border-white/10 p-8 transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-black/50"
          >
            <div className="flex-grow">
              <div className="text-sm md:text-base uppercase tracking-[0.3em] text-zinc-400 font-body">
                Essential Collection
              </div>
              <div className="mt-4 font-serifDisplay font-semibold text-2xl text-white">
                The Classic
              </div>
              <div className="mt-4 text-3xl md:text-4xl font-body font-bold text-amber-500">
                ₹35k - ₹40k
              </div>

              <ul className="mt-8 space-y-3">
                <Feature>Traditional Videography (Max 2 Hours)</Feature>
                <Feature>Karizma Album (Max 40 Sheets)</Feature>
                <Feature>Invitation Video &amp; Digital Card</Feature>
                <Feature>Album Type: Box (Handle Briefcase)</Feature>
              </ul>

              <div className="mt-8 text-sm md:text-base text-zinc-400 font-body leading-relaxed">
                <span className="text-amber-500">Note:</span> Highlight Video (5 min) included only on ₹40k package.
              </div>
            </div>

            <a href="#contact" className="mt-auto pt-8 block">
              <span className="w-full py-4 rounded-lg font-serifDisplay font-bold tracking-[0.2em] text-white uppercase text-xs bg-gradient-to-br from-amber-500 to-amber-700 border-t border-white/20 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.02] hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 ease-out relative overflow-hidden group inline-flex items-center justify-center">
                <span className="relative z-10">Book This Package</span>
                <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </a>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={item}
            className="relative flex flex-col h-full rounded-2xl bg-transparent border border-white/10 p-8 transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-black/50"
          >
            <div className="bg-amber-500 text-black text-[10px] px-3 py-1 uppercase font-bold tracking-wider rounded-full absolute -top-3 left-1/2 -translate-x-1/2">
              Most Popular
            </div>

            <div className="flex-grow">
              <div className="text-sm md:text-base uppercase tracking-[0.3em] text-zinc-400 font-body">
                Signature Collection
              </div>
              <div className="mt-4 font-serifDisplay font-semibold text-2xl text-white">
                The Premium
              </div>
              <div className="mt-4 text-3xl md:text-4xl font-body font-bold text-amber-500">
                ₹50,000
              </div>

              <ul className="mt-8 space-y-3">
                <Feature>Traditional Videography (Max 2 Hours)</Feature>
                <Feature>Wedding Highlight Video (5-7 Min)</Feature>
                <Feature>Karizma Album (Max 50 Sheets)</Feature>
                <Feature>Invitation Card &amp; Video</Feature>
                <Feature>Album Type: Design Box</Feature>
                <Feature>Reels included.</Feature>
              </ul>
            </div>

            <a href="#contact" className="mt-auto pt-8 block">
              <span className="w-full py-4 rounded-lg font-serifDisplay font-bold tracking-[0.2em] text-white uppercase text-xs bg-gradient-to-br from-amber-500 to-amber-700 border-t border-white/20 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.02] hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 ease-out relative overflow-hidden group inline-flex items-center justify-center">
                <span className="relative z-10">Book This Package</span>
                <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </a>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={item}
            className="relative flex flex-col h-full rounded-2xl bg-transparent border border-white/10 p-8 transition-all duration-500 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-black/50"
          >
            <div className="flex-grow">
              <div className="text-sm md:text-base uppercase tracking-[0.3em] text-zinc-400 font-body">
                Cinematic Collection
              </div>
              <div className="mt-4 font-serifDisplay font-semibold text-2xl text-white">
                The Royal
              </div>
              <div className="mt-4 text-3xl md:text-4xl font-body font-bold text-amber-500">
                ₹60,000
              </div>

              <ul className="mt-8 space-y-3">
                <Feature>Traditional Videography (Max 2 Hours)</Feature>
                <Feature>Cinematic Teaser Video (5-7 Min)</Feature>
                <Feature>Karizma Album (55 Sheets)</Feature>
                <Feature>Drone / Gimbal Shots</Feature>
                <Feature>Invitation Card &amp; Video</Feature>
                <Feature>Album Type: Gemini or Piano Box (Premium)</Feature>
                <Feature>Reels of Each Event.</Feature>
              </ul>
            </div>

            <a href="#contact" className="mt-auto pt-8 block">
              <span className="w-full py-4 rounded-lg font-serifDisplay font-bold tracking-[0.2em] text-white uppercase text-xs bg-gradient-to-br from-amber-500 to-amber-700 border-t border-white/20 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.6)] hover:scale-[1.02] hover:-translate-y-1 active:scale-95 active:translate-y-0 transition-all duration-300 ease-out relative overflow-hidden group inline-flex items-center justify-center">
                <span className="relative z-10">Book This Package</span>
                <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </a>
          </motion.div>
        </motion.div>

        {/* Add-ons */}
        <Reveal delay={0.05} className="mt-10">
          <div className="w-full rounded-xl border border-white/10 bg-transparent px-6 py-6">
            <div className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-500 font-body">
              Add-On Services
            </div>
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-base md:text-lg text-zinc-300">
              <div>📸 Pre-Wedding Shoots: <span className="text-amber-500">₹15,000/-</span></div>
              <div>💍 Ring Ceremony: <span className="text-amber-500">₹10,000/-</span></div>
              <div>🚁 Drone Coverage: <span className="text-amber-500">₹5,000/-</span> per day</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
