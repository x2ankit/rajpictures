import { motion } from "framer-motion";

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

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.2, 0, 0.2, 1] as const,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.25,
      ease: [0.2, 0, 0.2, 1] as const,
    },
  },
};

const actionsVariants = {
  show: { opacity: 0, y: 14, transition: { duration: 0.2 } },
  hover: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export const ServicesGrid = () => {
  return (
    <section id="services" className="px-6 py-24 md:py-32">
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
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl">
            Cinematic, story-driven coverage with premium finishing.
          </p>
        </motion.div>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.number}
              variants={cardVariants}
              whileHover="hover"
              className="group relative overflow-hidden rounded-2xl p-8 bg-white/5 border border-white/10 backdrop-blur-sm"
              style={{ willChange: "transform" }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={false}
                animate={{ opacity: 1 }}
              />

              {/* Watermark number */}
              <div className="absolute inset-0 flex items-center justify-center select-none">
                <div className="text-9xl font-display opacity-10 text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.16)]">
                  #{service.number}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <h3 className="text-lg md:text-xl font-display font-bold uppercase tracking-wide text-zinc-100">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {service.description}
                </p>
              </div>

              {/* Hover reveal actions */}
              <motion.div
                variants={actionsVariants}
                className="absolute inset-x-6 bottom-6 flex items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto"
              >
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
              </motion.div>

              {/* Focus glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-[0_0_30px_rgba(168,85,247,0.18)]" />
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-amber-500/40 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
