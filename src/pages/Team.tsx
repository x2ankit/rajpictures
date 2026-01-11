import { motion } from "framer-motion";
import { Seo } from "@/components/Seo";

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
    name: "Rohit",
    role: "Photographer",
    image: "/team/ankit.jpg",
  },
  {
    name: "Ratan",
    role: "Photographer",
    image: "/team/ratan.jpg",
  },
];

export default function Team() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Meet the Raj Pictures Team",
    url: "https://www.rajpictures.in/team",
    description:
      "Meet the cinematographers and photographers behind Raj Pictures delivering cinematic wedding films and editorial-style portraits across Odisha.",
  };

  return (
    <>
      <Seo
        title="Meet the Raj Pictures Team"
        description="Cinematographers, candid photographers, and storytellers crafting cinematic wedding films and editorial portraits across Odisha, Bonaigarh, and Deogarh. Meet the Raj Pictures crew."
        pathname="/team"
        type="website"
        keywords={[
          "wedding photographers in Bonaigarh",
          "cinematographers Odisha",
          "candid photographers",
          "wedding videographers",
          "professional photography team",
          "wedding film crew",
          "Deogarh wedding team",
        ]}
        schema={aboutSchema}
      />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* 1. Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
          OUR <span className="text-amber-500">TEAM</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light tracking-wide">
          A collective of visionaries dedicated to turning your moments into
          cinematic masterpieces.
        </p>
      </motion.div>

      {/* Team Grid */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] group"
          >
            {/* Image Card */}
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 mb-6 relative transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 z-10 transition-opacity duration-500 group-hover:opacity-40" />
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover brightness-90 saturate-[0.85] contrast-110 group-hover:brightness-110 group-hover:saturate-110 group-hover:scale-110 transition-all duration-700 ease-out"
              />
            </div>

            {/* Text Info */}
            <div className="text-center relative z-20">
              <h3 className="text-3xl font-display text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                {member.name}
              </h3>
              <div className="flex items-center justify-center gap-3">
                <span className="h-[1px] w-6 bg-zinc-800 group-hover:bg-amber-600 transition-colors duration-300" />
                <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-semibold">
                  {member.role}
                </p>
                <span className="h-[1px] w-6 bg-zinc-800 group-hover:bg-amber-600 transition-colors duration-300" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </>
  );
}
