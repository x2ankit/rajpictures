import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const progress = useMotionValue(0);
  const [percent, setPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Turbo loader timings (<= 1.5s total progress)
  const toSeventyMs = 800;
  const pauseMs = 250;
  const toHundredMs = 200;

  // Exit timing (simple fade)
  const exitDurationMs = 350;
  const exitEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

  const status = useMemo(() => {
    if (percent < 35) return "Initializing Sensor...";
    if (percent < 75) return "Checking Focus...";
    if (percent < 100) return "Calibrating Exposure...";
    return "Ready";
  }, [percent]);

  useEffect(() => {
    let cancelled = false;
    const controls: Array<ReturnType<typeof animate>> = [];

    const run = async () => {
      // 0% -> 70% fast
      controls.push(
        animate(progress, 70, {
          duration: toSeventyMs / 1000,
          ease: "linear",
          onUpdate: (v) =>
            setPercent(Math.min(100, Math.max(0, Math.round(v)))),
        })
      );

      await new Promise((r) => window.setTimeout(r, toSeventyMs + pauseMs));
      if (cancelled) return;

      // 70% -> 100% sprint
      controls.push(
        animate(progress, 100, {
          duration: toHundredMs / 1000,
          ease: "linear",
          onUpdate: (v) =>
            setPercent(Math.min(100, Math.max(0, Math.round(v)))),
          onComplete: () => {
            setPercent(100);
            setIsExiting(true);
            window.setTimeout(() => onComplete(), exitDurationMs);
          },
        })
      );
    };

    void run();

    return () => {
      cancelled = true;
      controls.forEach((c) => c.stop());
    };
  }, [onComplete, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: exitDurationMs / 1000, ease: exitEase } }}
      aria-label="Loading"
    >
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        animate={isExiting ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: exitEase }}
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
              className="h-px bg-amber-500/70"
              style={{ width: `${percent}%` }}
              transition={{ duration: 0.12 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
