import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const lensY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const lensRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const lensScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background glow orbs - subtle purple */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px]" />
      </div>

      {/* Large Brand Name - Behind everything */}
      <motion.h1 
        className="absolute text-[15vw] md:text-[12vw] font-display tracking-[0.2em] text-foreground/10 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        CAMERAWALA
      </motion.h1>

      {/* CSS Camera Lens - On top of text */}
      <motion.div
        className="absolute z-10"
        style={{ 
          y: lensY, 
          rotate: lensRotate,
          scale: lensScale
        }}
      >
        <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-muted/50 animate-lens-rotate" 
            style={{
              boxShadow: `
                inset 0 0 60px rgba(0,0,0,0.9),
                0 0 60px rgba(124, 58, 237, 0.15),
                0 0 100px rgba(0,0,0,0.6)
              `
            }}
          />
          
          {/* Middle ring */}
          <div className="absolute inset-3 rounded-full border-2 border-muted/30"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)"
            }}
          />
          
          {/* Inner lens glass */}
          <div className="absolute inset-6 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 30%),
                radial-gradient(circle at center, hsl(263 70% 50% / 0.08) 0%, hsl(0 0% 4%) 60%, hsl(0 0% 0%) 100%)
              `,
              boxShadow: `
                inset 0 0 80px rgba(0,0,0,0.95),
                inset 0 -15px 40px rgba(124, 58, 237, 0.08)
              `
            }}
          />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/40 glow-purple" />
          </div>

          {/* Aperture blades hint */}
          <div className="absolute inset-10 rounded-full border border-white/5" />
          <div className="absolute inset-14 rounded-full border border-white/3" />
        </div>
      </motion.div>

      {/* Glassmorphism Card - On top of lens */}
      <motion.div 
        className="absolute z-20 glass-card p-6 md:p-8 max-w-md mx-auto animate-float"
        style={{ y: 120 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className="text-xl md:text-2xl font-display text-accent mb-2">
          CAPTURE YOUR STORY
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Step into a world of creativity where every frame tells a unique narrative.
        </p>
      </motion.div>

      {/* Hero Tagline */}
      <motion.div 
        className="absolute z-10 text-center px-6"
        style={{ opacity: textOpacity, y: -100 }}
      >
        <motion.p 
          className="text-lg md:text-xl lg:text-2xl font-display tracking-[0.3em] text-foreground/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          WHERE VISION BECOMES AN EXPERIENCE
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-24 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest">SCROLL</span>
          <motion.div 
            className="w-px h-10 bg-gradient-to-b from-muted-foreground/50 to-transparent"
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
};
