import { AnimatePresence, motion } from "framer-motion";
import { Aperture } from "lucide-react";
import { useEffect, useState } from "react";

type Stage = "popup" | "pan" | "flash" | "finish";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [stage, setStage] = useState<Stage>("popup");

  useEffect(() => {
    const t1 = window.setTimeout(() => setStage("pan"), 1200);
    const t2 = window.setTimeout(() => setStage("flash"), 2000);
    const t3 = window.setTimeout(() => setStage("finish"), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (stage !== "finish") return;
    onComplete();
  }, [onComplete, stage]);

  if (stage === "finish") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      aria-label="Loading"
      animate={stage === "flash" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeInOut" }}
    >
      {/* The Camera/Lens Icon */}
      <AnimatePresence>
        {stage !== "flash" && (
          <motion.div
            key="lens"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              stage === "pan"
                ? { scale: 1, opacity: 1, x: 100 }
                : { scale: 1, opacity: 1, x: 0 }
            }
            exit={{ opacity: 0 }}
            transition={
              stage === "popup"
                ? { type: "spring", stiffness: 260, damping: 18 }
                : { duration: 0.8, ease: "easeInOut" }
            }
            className="text-amber-500"
          >
            <Aperture size={84} strokeWidth={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash overlay */}
      <AnimatePresence>
        {stage === "flash" && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-white z-50"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
