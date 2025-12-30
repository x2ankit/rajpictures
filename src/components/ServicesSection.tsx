import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  {
    number: "01",
    title: "Pre Wedding / Wedding Shoot",
    description: "Romantic, cinematic captures that tell the couple’s story.",
  },
  {
    number: "02",
    title: "Maternity Photography",
    description: "Soft, emotive portraits celebrating parenthood.",
  },
  {
    number: "03",
    title: "Newborn Photography",
    description: "Tender, detail-forward newborn portraits.",
  },
  {
    number: "04",
    title: "Kids Photography",
    description: "Playful, story-filled sessions.",
  },
  {
    number: "05",
    title: "Pre Birthday Photography",
    description: "Vivid, joyful portraits.",
  },
  {
    number: "06",
    title: "Fashion & Commercial",
    description: "High-concept visuals for brands.",
  },
] as const;

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.2, 0, 0.2, 1] as const },
  },
};

export const ServicesSection = () => {
  const [active, setActive] = useState<string | null>(null);

  const isHovering = active !== null;

  return (
    <section
      id="services"
      className="relative px-6 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
            SERVICES
          </h2>
        </motion.div>
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {services.map((service) => {
            const isActive = active === service.number;
            const dim = isHovering && !isActive;

            return (
              <motion.div
                key={service.number}
                variants={rowVariants}
                onMouseEnter={() => setActive(service.number)}
                onMouseLeave={() => setActive(null)}
                className={
                  "group border-b border-white/10 py-10 transition-opacity " +
                  (dim ? "opacity-30" : "opacity-100")
                }
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Number (huge hollow) */}
                  <div className="w-full lg:w-[140px] flex-shrink-0">
                    <div
                      className={
                        "text-7xl md:text-8xl font-display leading-none text-transparent transition-all duration-300 " +
                        (isActive ? "" : "")
                      }
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.28)" } as React.CSSProperties}
                    >
                      #{service.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div
                      className={
                        "text-3xl md:text-5xl font-display uppercase tracking-wide transition-colors duration-300 " +
                        (isActive ? "text-white" : "text-zinc-200")
                      }
                    >
                      {service.title}
                    </div>
                    <p className="mt-3 text-sm md:text-base text-zinc-400 max-w-2xl">
                      {service.description}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 lg:justify-end">
                    <motion.a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-medium border border-white/15 text-zinc-200 bg-transparent hover:bg-white/10 transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.a>
                    <motion.a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold bg-white text-black hover:bg-primary hover:text-black transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      Pricing
                    </motion.a>
                  </div>
                </div>

                {/* Hover accent line */}
                <div
                  className={
                    "h-px w-0 bg-primary/60 mt-6 transition-all duration-300 " +
                    (isActive ? "w-full" : "group-hover:w-full")
                  }
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
