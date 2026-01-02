import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PROMO_SESSION_KEY = "rajpictures:newyear-promo:seen";
const OPEN_EVENT = "rajpictures:promo-open";

function scrollToHash(hash: "#pricing" | "#contact") {
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // If user is not on the home route (or section isn't mounted), navigate to home + hash.
  window.location.assign(`/${hash}`);
}

export function openPromoPopup() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const shouldAutoShow = useMemo(() => {
    try {
      return sessionStorage.getItem(PROMO_SESSION_KEY) !== "1";
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!shouldAutoShow) return;

    const t = window.setTimeout(() => {
      setIsOpen(true);
      try {
        sessionStorage.setItem(PROMO_SESSION_KEY, "1");
      } catch {
        // ignore
      }
    }, 2000);

    return () => window.clearTimeout(t);
  }, [shouldAutoShow]);

  const close = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(PROMO_SESSION_KEY, "1");
    } catch {
      // ignore
    }
  };

  const claim = () => {
    close();
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
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
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
                  onClick={close}
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
                    onClick={close}
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
