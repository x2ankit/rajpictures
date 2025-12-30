import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse-driven tilt (keep 3D feel)
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const tiltXSpring = useSpring(tiltX, { stiffness: 180, damping: 22, mass: 0.5 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 180, damping: 22, mass: 0.5 });
  const pointerXSpring = useSpring(pointerX, { stiffness: 220, damping: 26, mass: 0.45 });
  const pointerYSpring = useSpring(pointerY, { stiffness: 220, damping: 26, mass: 0.45 });

  const lensRotateX = useTransform(tiltXSpring, (v) => v);
  const lensRotateY = useTransform(tiltYSpring, (v) => v);
  const lensRotateZ = useTransform(tiltYSpring, (v) => v * 0.2);

  const glassHighlight = useTransform(
    [pointerXSpring, pointerYSpring],
    ([x, y]) =>
      `radial-gradient(circle at ${Math.round(x * 100)}% ${Math.round(y * 100)}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 18%, rgba(255,255,255,0.02) 28%, transparent 45%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width;
    const y = (e.clientY - bounds.top) / bounds.height;

    const max = 12;
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;
    tiltX.set(rx);
    tiltY.set(ry);

    pointerX.set(Math.min(1, Math.max(0, x)));
    pointerY.set(Math.min(1, Math.max(0, y)));
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#2e1065] via-black to-black"
    >
      {/* 2. Title (Background layer) */}
      <motion.h1
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 font-display text-[11vw] tracking-tighter whitespace-nowrap bg-gradient-to-b from-white/20 to-white/5 bg-clip-text text-transparent select-none pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
      >
        CAMERAWALA
      </motion.h1>

      {/* 3. Lens (Middle layer) */}
      <div
        className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX: lensRotateX,
            rotateY: lensRotateY,
            rotateZ: lensRotateZ,
            transformStyle: "preserve-3d",
          }}
          className="will-change-transform"
        >
          <div className="relative w-[520px] h-[520px] max-w-[82vw] max-h-[82vw]">
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

            <div
              className="absolute inset-[34px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.98) 60%, rgba(0,0,0,1) 100%)",
                border: "2px solid rgba(255,255,255,0.08)",
              }}
            />

            <div
              className="absolute inset-[64px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 18%, rgba(124,58,237,0.08) 35%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,1) 100%)",
                boxShadow:
                  "inset 0 0 120px rgba(0,0,0,0.95), inset 0 -30px 80px rgba(124,58,237,0.08)",
              }}
            />

            <motion.div
              className="absolute inset-[64px] rounded-full pointer-events-none will-change-opacity"
              style={{ background: glassHighlight, opacity: 0.9 }}
            />

            <div className="absolute inset-[110px] rounded-full border border-white/10" />
            <div className="absolute inset-[140px] rounded-full border border-white/8" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_40px_rgba(124,58,237,0.35)]" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Content (Top layer) */}
      <div className="absolute z-20 top-8 right-12">
        <a
          href="#services"
          className="text-xs font-display tracking-[0.35em] uppercase text-white/70 hover:text-white transition-colors"
        >
          MENU
        </a>
      </div>

      <motion.div
        className="absolute z-20 bottom-12 left-12 glass-card p-5 md:p-6 max-w-xs"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
      >
        <p className="text-sm md:text-base text-foreground">
          <span className="font-display tracking-wide">Capture Your Story</span>
          <span className="text-muted-foreground"> — Step into a world of creativity.</span>
        </p>
      </motion.div>
    </section>
  );
};
