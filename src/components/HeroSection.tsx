import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Scroll-driven motion
  const lensRotateXBase = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const lensRotateZBase = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const lensY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Mouse-driven tilt
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 180, damping: 22, mass: 0.5 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 180, damping: 22, mass: 0.5 });

  const lensRotateX = useTransform([lensRotateXBase, tiltXSpring], ([a, b]) => a + b);
  const lensRotateY = useTransform([tiltYSpring], ([b]) => b);
  const lensRotateZ = useTransform([lensRotateZBase, tiltYSpring], ([a, b]) => a + b * 0.25);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;

    const max = 10; // degrees
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;
    tiltX.set(rx);
    tiltY.set(ry);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1: Large Brand Name - Behind everything */}
      <motion.h1 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-display font-bold tracking-wider text-white/5 select-none whitespace-nowrap z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        CAMERAWALA
      </motion.h1>

      {/* Layer 2: CSS Camera Lens - 3D perspective + scroll rotation + mouse tilt */}
      <div
        className="absolute z-10"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            y: lensY,
            rotateX: lensRotateX,
            rotateY: lensRotateY,
            rotateZ: lensRotateZ,
            transformStyle: "preserve-3d",
          }}
          className="will-change-transform"
        >
          <div className="relative w-[520px] h-[520px] max-w-[82vw] max-h-[82vw]">
            {/* Outer body */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 18%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,1) 100%)",
                boxShadow:
                  "inset 0 0 80px rgba(0,0,0,0.95), 0 0 60px rgba(124,58,237,0.10)",
                border: "10px solid rgba(255,255,255,0.06)",
              }}
            />

            {/* Bezel ring */}
            <div
              className="absolute inset-[34px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,1) 100%)",
                border: "2px solid rgba(255,255,255,0.08)",
              }}
            />

            {/* Glass */}
            <div
              className="absolute inset-[64px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 18%, rgba(124,58,237,0.08) 35%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,1) 100%)",
                boxShadow:
                  "inset 0 0 120px rgba(0,0,0,0.95), inset 0 -30px 80px rgba(124,58,237,0.08)",
              }}
            />

            {/* Aperture hint */}
            <div className="absolute inset-[110px] rounded-full border border-white/10" />
            <div className="absolute inset-[140px] rounded-full border border-white/8" />

            {/* Center spec */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_40px_rgba(124,58,237,0.35)]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Layer 3: Glassmorphism Card - Bottom left corner */}
      <motion.div 
        className="absolute z-20 bottom-24 left-6 md:left-10 glass-card p-5 md:p-6 max-w-xs"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <p className="text-sm md:text-base text-foreground">
          <span className="font-display tracking-wide">Capture Your Story</span>
          <span className="text-muted-foreground"> — Step into a world of creativity.</span>
        </p>
      </motion.div>
    </section>
  );
};
