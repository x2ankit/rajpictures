import { motion } from "framer-motion";

const cards = [
  {
    title: "Wedding",
    href: "#portfolio",
    image: "/moody-card.svg",
  },
  {
    title: "Films",
    href: "#films",
    image: "/moody-card.svg",
  },
  {
    title: "Portraits",
    href: "#portfolio",
    image: "/moody-card.svg",
  },
] as const;

export const ServiceCards = () => {
  return (
    <section className="bg-black px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 text-center"
        >
          <p className="text-amber-500 text-xs uppercase tracking-[0.35em]">Cinematic Services</p>
          <h2 className="mt-4 font-serifDisplay text-5xl md:text-6xl text-white tracking-tight">
            Crafted for stories worth remembering
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: [0.2, 0, 0.2, 1] }}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-zinc-950"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="absolute inset-0 bg-black/60 transition-colors duration-700 group-hover:bg-black/35" />

              <div className="relative z-10 flex h-[420px] flex-col p-7">
                <div className="flex-1 flex items-center justify-center">
                  <div className="font-serifDisplay text-4xl text-amber-500 text-center">{card.title}</div>
                </div>

                <div className="translate-y-6 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <a
                    href={card.href}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
