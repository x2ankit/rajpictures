import { motion } from "framer-motion";

// 👥 The Complete Team List (Based on your screenshots)
const teamMembers = [
  {
    name: "Rinku",
    role: "Cinematographer",
    image: "/team/rinku.jpg",
  },
  {
    name: "Pintu",
    role: "Candid Photographer",
    image: "/team/pintu.jpg",
  },
  {
    name: "Jiten",
    role: "Videographer",
    image: "/team/jiten.jpg",
  },
  {
    name: "Daya",
    role: "Cinematographer",
    image: "/team/daya.jpg",
  },
  {
    name: "Sanjiv",
    role: "Model Photographer",
    image: "/team/sanjiv.jpg",
  },
  {
    name: "Ankit",
    role: "Photographer",
    image: "/team/ankit.jpg",
  },
];

export default function Team() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
          The <span className="text-amber-500">Artists</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light tracking-wide">
          A collective of visionaries dedicated to turning your moments into
          cinematic masterpieces.
        </p>
      </motion.div>

      {/* 2. The Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative flex flex-col items-center"
          >
            {/* Image Container with "Golden Spotlight" Effect */}
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg mb-6">
              {/* Border Glow (Visible on Hover) */}
              <div className="absolute inset-0 border border-white/10 rounded-lg z-20 transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]" />

              {/* Gradient Overlay for Mood */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 z-10 transition-opacity duration-500 group-hover:opacity-20" />

              {/* The Image */}
              <img
                src={member.image}
                alt={member.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover \
                           brightness-90 contrast-[1.05] saturate-[0.9] \
                           transform transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] \
                           group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-110"
              />
            </div>

            {/* Text Info (Styled like a Magazine) */}
            <div className="text-center relative z-20">
              <h3 className="text-3xl font-display font-medium text-white mb-2 tracking-wide group-hover:text-amber-400 transition-colors duration-300">
                {member.name}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-8 bg-zinc-700 group-hover:bg-amber-600 transition-colors duration-300" />
                <p className="text-zinc-500 text-xs tracking-[0.25em] uppercase font-semibold group-hover:text-zinc-300 transition-colors duration-300">
                  {member.role}
                </p>
                <span className="h-[1px] w-8 bg-zinc-700 group-hover:bg-amber-600 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
