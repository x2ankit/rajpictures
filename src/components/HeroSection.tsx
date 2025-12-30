import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const lensY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const lensRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const lensScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* CSS Camera Lens */}
      <motion.div
        className="absolute"
        style={{ 
          y: lensY, 
          rotate: lensRotate,
          scale: lensScale
        }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-8 border-muted/60 animate-lens-rotate" 
            style={{
              boxShadow: `
                inset 0 0 60px rgba(0,0,0,0.8),
                0 0 40px rgba(124, 58, 237, 0.2),
                0 0 80px rgba(0,0,0,0.5)
              `
            }}
          />
          
          {/* Middle ring */}
          <div className="absolute inset-4 rounded-full border-4 border-muted/40"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            }}
          />
          
          {/* Inner lens glass */}
          <div className="absolute inset-8 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 30%),
                radial-gradient(circle at center, hsl(263 70% 50% / 0.1) 0%, hsl(0 0% 5%) 60%, hsl(0 0% 0%) 100%)
              `,
              boxShadow: `
                inset 0 0 80px rgba(0,0,0,0.9),
                inset 0 -20px 40px rgba(124, 58, 237, 0.1)
              `
            }}
          />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple to-purple/50 glow-purple" />
          </div>

          {/* Aperture blades hint */}
          <div className="absolute inset-12 rounded-full border border-white/5" />
          <div className="absolute inset-16 rounded-full border border-white/5" />
        </div>
      </motion.div>

      {/* Hero Text */}
      <motion.div 
        className="relative z-10 text-center px-6 mt-32 md:mt-40"
        style={{ opacity: textOpacity }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-display mb-6 tracking-wider"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-foreground">WHERE VISION</span>
          <br />
          <span className="text-gradient-purple">BECOMES AN EXPERIENCE</span>
        </motion.h1>
        
        {/* Glassmorphism Card */}
        <motion.div 
          className="glass-card p-6 md:p-8 max-w-md mx-auto mt-12 animate-float"
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-32 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground tracking-widest">SCROLL</span>
          <motion.div 
            className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent"
            animate={{ scaleY: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.div>
    </section>
  );
};
