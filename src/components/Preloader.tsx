import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
          aria-label="Loading"
        >
          <h1 className="text-6xl font-bold text-amber-500 font-display">
            {count}%
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
