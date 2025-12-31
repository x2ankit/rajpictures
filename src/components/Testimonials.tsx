import { motion } from "framer-motion";

const reviews = [
  {
    name: "Priya & Arjun",
    quote:
      "Raj captured our wedding so beautifully. Every photo tells a story, and watching our film still brings tears to our eyes.",
  },
  {
    name: "Sneha & Vikram",
    quote:
      "The team was incredibly professional and made us feel so comfortable. The pre-wedding shoot was beyond our expectations!",
  },
  {
    name: "Ananya & Rohit",
    quote:
      "From the first meeting to the final album delivery, everything was perfect. Raj Photography is worth every penny!",
  },
] as const;

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
          className="text-center mb-14"
        >
          <div className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-amber-500 font-body">
            LOVE NOTES
          </div>
          <h2 className="mt-5 text-4xl md:text-6xl text-white font-serifDisplay">
            What Our Couples Say
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: { opacity: 1 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12, delayChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((r) => (
            <motion.div
              key={r.name}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: [0.2, 0, 0.2, 1] as const },
                },
              }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="bg-white/5 border border-white/10 p-8 rounded-sm"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} aria-hidden className="text-lg leading-none">
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-6 text-zinc-300 leading-relaxed italic font-serifDisplay">
                “{r.quote}”
              </p>

              <div className="mt-8 text-amber-500 uppercase tracking-[0.25em] text-xs font-body">
                {r.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
