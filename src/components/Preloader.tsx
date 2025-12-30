import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const progress = useMotionValue(0);
  const [percent, setPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const durationSeconds = 2.3;
  const exitDurationMs = 650;

  const status = useMemo(() => {
    if (percent < 35) return "Initializing Sensor...";
    if (percent < 75) return "Checking Focus...";
    if (percent < 100) return "Calibrating Exposure...";
    return "Ready";
  }, [percent]);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setPercent(Math.min(100, Math.max(0, Math.round(v)))),
      onComplete: () => {
        setPercent(100);
        setTimeout(() => setIsExiting(true), 120);
        setTimeout(() => onComplete(), exitDurationMs + 200);
      },
    });

    return () => controls.stop();
  }, [onComplete, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background text-foreground"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      aria-label="Loading"
    >
      {/* Shutter panels (split reveal) */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-0 right-0 top-0 h-1/2 bg-black"
          initial={{ y: 0 }}
          animate={isExiting ? { y: "-100%" } : { y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-1/2 bg-black"
          initial={{ y: 0 }}
          animate={isExiting ? { y: "100%" } : { y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Center content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={isExiting ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center">
          <div className="font-mono text-5xl md:text-7xl tracking-widest tabular-nums">
            {String(percent).padStart(3, "0")}%
          </div>

          <div className="mt-5 h-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[11px] font-mono text-zinc-500 tracking-[0.25em]"
              >
                {status}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* subtle progress hint line */}
          <div className="mt-6 w-56 md:w-72 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-px bg-primary/70"
              style={{ width: `${percent}%` }}
              transition={{ duration: 0.12 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
