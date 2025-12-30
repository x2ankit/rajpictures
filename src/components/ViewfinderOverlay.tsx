import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const shutterSpeeds = Array.from({ length: 19 }, (_, i) => `1/${100 + i * 50}`);

export const ViewfinderOverlay = () => {
  const { scrollYProgress } = useScroll();

  // Add a tiny bit of inertia so the dial feels mechanical/heavy.
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.6 });

  // Map vertical scroll (0..1) to horizontal dial movement.
  // Using percentage keeps it responsive; padding centers the dial under the triangle.
  const rulerX = useTransform(scrollSpring, [0, 1], ["0%", "-50%"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        {/* Left: REC indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-rec" />
            <span className="text-[10px] font-mono text-red-500 tracking-wider">REC</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
            4K 60
          </span>
        </div>
      </div>

      {/* Shutter Speed Ruler - Bottom */}

      <div className="absolute bottom-0 left-0 right-0 pb-5 flex flex-col items-center">
        {/* Red indicator triangle (stationary) */}
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-red-600 mb-1 z-10" />

        {/* Sliding ruler */}
        <div className="w-full max-w-5xl px-6">
          <div className="relative h-10 overflow-hidden mask-linear-gradient">
            <motion.div
              style={{ x: rulerX }}
              className="flex items-end gap-8 pl-[50vw] pr-[50vw] w-max"
            >
              {shutterSpeeds.map((speed, i) => (
                <div key={speed} className="flex flex-col items-center gap-2 shrink-0 opacity-70">
                  <div className={`w-px bg-white/80 ${i % 2 === 0 ? "h-3" : "h-1.5"}`} />
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest whitespace-nowrap">
                    {speed}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Cinematic edge fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
