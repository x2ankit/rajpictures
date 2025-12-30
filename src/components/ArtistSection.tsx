import { motion } from "framer-motion";
import photographerImage from "@/assets/photographer-profile.jpg";

export const ArtistSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      {/* Profile Image with cinematic effects */}
      <div className="relative group cursor-pointer">
        {/* Image container with gradient mask */}
        <div className="relative overflow-hidden rounded-xl border border-border/20">
          <img
            src="/image_129164.jpg"
            alt="RAJ - Lead Photographer"
            className="w-full aspect-[4/5] object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = photographerImage;
            }}
          />
          {/* Bottom gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Subtle glow overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
        </div>

        {/* Purple glow effect */}
        <div className="absolute -inset-1 rounded-xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </div>

      {/* Artist Info */}
      <div className="mt-6 text-center lg:text-left">
        <h3 className="text-3xl md:text-4xl font-anton tracking-wider text-foreground">
          RAJ
        </h3>
        <p className="text-sm font-mono text-primary tracking-widest mt-1">
          LEAD PHOTOGRAPHER & CREATIVE DIRECTOR
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed mt-4 max-w-sm mx-auto lg:mx-0">
          Capturing the soul of the moment. With over 10 years of experience behind the lens, 
          transforming fleeting seconds into timeless art.
        </p>
      </div>
    </motion.div>
  );
};
