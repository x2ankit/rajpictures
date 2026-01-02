import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const progress = useMotionValue(0);
  const [percent, setPercent] = useState(0);

  // Turbo loader timings (<= 1.5s total progress)
  const toSeventyMs = 800;
  const toHundredMs = 120; // near-instant sprint
  const doneDelayMs = 200;

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

      await new Promise((r) => window.setTimeout(r, toSeventyMs));
      if (cancelled) return;

      // 70% -> 100% sprint (near-instant)
      controls.push(
        animate(progress, 100, {
          duration: toHundredMs / 1000,
          ease: "linear",
          onUpdate: (v) =>
            setPercent(Math.min(100, Math.max(0, Math.round(v)))),
          onComplete: () => {
            setPercent(100);
            window.setTimeout(() => onComplete(), doneDelayMs);
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
      key="preloader"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="Loading"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-amber-500 font-display tabular-nums">
        {percent}%
      </h1>
    </motion.div>
  );
}
