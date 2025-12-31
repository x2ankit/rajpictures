import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const id = hash.replace("#", "").trim();
    if (!id) return;

    const run = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Wait for route content to paint.
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [location.hash, location.pathname]);

  return null;
}
