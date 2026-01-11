import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Stage = "popup" | "pan" | "flash" | "finish";

type PreloaderProps = {
  onComplete?: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [stage, setStage] = useState<Stage>("popup");
  const location = useLocation();
  const didCompleteRef = useRef(false);

  const isHomePage = location.pathname === "/";

  const complete = () => {
    if (didCompleteRef.current) return;
    didCompleteRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    // Only show on the Home Page (/) — reliable for debugging.
    if (!isHomePage) return;

    didCompleteRef.current = false;
    setStage("popup");

    // 🎬 Animation Timeline
    const t1 = window.setTimeout(() => setStage("pan"), 1200);
    const t2 = window.setTimeout(() => setStage("flash"), 2600);
    const t3 = window.setTimeout(() => setStage("finish"), 3200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [isHomePage, location.pathname]);

  useEffect(() => {
    if (stage !== "finish") return;
    complete();
  }, [stage]);

  if (!isHomePage || stage === "finish") return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden">
      {/* 1. The Camera Icon (Moves Left) */}
      <AnimatePresence>
        {stage !== "flash" && (
          <motion.div
            key="camera"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              stage === "pan"
                ? { scale: 1, opacity: 1, x: -140 }
                : { scale: 1, opacity: 1, x: 0 }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-amber-500 absolute z-20"
            aria-label="Loading"
          >
            <Camera size={64} strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. The Text Reveal (Appears on the Right) */}
      <AnimatePresence>
        {stage === "pan" && (
          <motion.div
            key="brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="absolute z-10 flex flex-col items-start justify-center pl-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight whitespace-nowrap">
              rajpictures<span className="text-amber-500">.in</span>
            </h1>
            <p className="text-zinc-500 text-[10px] md:text-xs tracking-[0.4em] uppercase mt-1">
              Cinematic Visuals
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The Flash Effect (Transition to Website) */}
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
    </div>
  );
}
