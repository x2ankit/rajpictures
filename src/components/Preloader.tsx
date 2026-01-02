import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type Stage = "popup" | "pan" | "flash" | "finish";

type PreloaderProps = {
  onComplete?: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [stage, setStage] = useState<Stage>("popup");
  const location = useLocation();
  const didCompleteRef = useRef(false);

  const shouldShow = useMemo(() => {
    const isHomePage = location.pathname === "/";
    if (!isHomePage) return false;

    try {
      const loadCount = Number(sessionStorage.getItem("load_count") || "0");
      return loadCount < 3;
    } catch {
      // If sessionStorage is unavailable for any reason, fail open for home only.
      return true;
    }
  }, [location.pathname]);

  const complete = () => {
    if (didCompleteRef.current) return;
    didCompleteRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    // 🛡️ Gatekeeper: block instantly off-home OR after 3 session loads.
    if (!shouldShow) {
      setStage("finish");
      complete();
      return;
    }

    // Increase session load counter only when we actually show.
    try {
      const loadCount = Number(sessionStorage.getItem("load_count") || "0");
      sessionStorage.setItem("load_count", String(loadCount + 1));
    } catch {
      // ignore
    }

    // 🎬 Animation Sequence
    const t1 = window.setTimeout(() => setStage("pan"), 1200);
    const t2 = window.setTimeout(() => setStage("flash"), 2000);
    const t3 = window.setTimeout(() => setStage("finish"), 2200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [shouldShow]);

  useEffect(() => {
    if (stage !== "finish") return;
    complete();
  }, [stage]);

  if (!shouldShow || stage === "finish") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      aria-label="Loading"
      animate={{ opacity: 1 }}
    >
      {/* The Camera Icon */}
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
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-amber-500"
          >
            <Camera size={80} strokeWidth={1} />
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
