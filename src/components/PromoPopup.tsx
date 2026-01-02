import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect } from "react";

function scrollToHash(hash: "#pricing" | "#contact") {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // If user is not on the home route (or section isn't mounted), navigate to home + hash.
  window.location.assign(`/${hash}`);
}

type PromoPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PromoPopup({ isOpen, onClose }: PromoPopupProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Only listen when the popup is actually open
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    // Cleanup: Remove listener when popup closes or component unmounts
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const claim = () => {
    onClose();
    scrollToHash("#contact");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center px-5 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="New Year Offer"
          onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="relative w-full max-w-xl"
          >
            <div className="rounded-2xl p-[1px] bg-gradient-to-r from-amber-500/60 via-yellow-300/30 to-amber-500/60">
              <div className="relative rounded-2xl bg-black px-7 py-8 md:px-10 md:py-10">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-amber-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <div className="text-[11px] md:text-xs uppercase tracking-widest text-amber-500 font-body">
                    ✨ CELEBRATE IN STYLE ✨
                  </div>

                  <h3 className="mt-4 font-serifDisplay text-3xl md:text-4xl text-white tracking-tight">
                    Exclusive New Year Offer
                  </h3>

                  <p className="mt-4 text-sm md:text-base text-zinc-300 font-body leading-relaxed">
                    Book your 2026 Wedding this month and get{" "}
                    <span className="text-amber-500 font-semibold">Flat ₹5,000 OFF</span> +{" "}
                    <span className="text-amber-500 font-semibold">Free Drone Teaser</span>.
                  </p>

                  <button
                    type="button"
                    onClick={claim}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-amber-400"
                  >
                    CLAIM OFFER NOW
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
