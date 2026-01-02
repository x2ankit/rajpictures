import { AnimatePresence, motion } from "framer-motion";
import { Aperture, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "HOME", hash: "#home" },
  { label: "ABOUT", hash: "#about" },
  { label: "SERVICES", hash: "#services" },
  { label: "PORTFOLIO", hash: "#portfolio" },
  { label: "GALLERY", href: "/gallery" },
  { label: "FILMS", hash: "#films" },
  { label: "CONTACT", hash: "#contact" },
] as const;

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close mobile overlay on navigation.
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header
      className={
        "fixed top-0 left-0 right-0 z-50 py-5 px-6 md:px-12 lg:px-24 transition-colors " +
        (scrolled
          ? "bg-black/80 backdrop-blur-md"
          : "bg-gradient-to-b from-black/70 to-transparent")
      }
    >
      <div className="w-full grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={(e) => {
            // If already home, avoid navigation and just scroll.
            if (isHome) {
              e.preventDefault();
              scrollToTop();
            }
          }}
          className="inline-flex items-center gap-3 leading-none"
        >
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Aperture className="h-5 w-5 text-amber-500" />
          </span>
          <span className="inline-flex flex-col">
            <span className="font-brand text-lg md:text-xl tracking-tight">
              <span className="text-white">Raj</span> <span className="text-amber-500">Pictures</span>
            </span>
            <span className="text-[9px] md:text-[10px] text-zinc-400 tracking-[0.35em] uppercase mt-1">
              CINEMATIC VISUALS &amp; STORYTELLING
            </span>
          </span>
        </Link>

        {/* Center: Menu */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {navLinks.map((l) => {
            if ("href" in l) {
              return (
                <Link
                  key={l.label}
                  to={l.href}
                  className="text-xs uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors"
                >
                  {l.label}
                </Link>
              );
            }

            if (isHome) {
              if (l.label === "HOME") {
                return (
                  <a
                    key={l.label}
                    href={l.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToTop();
                    }}
                    className="text-xs uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors"
                  >
                    {l.label}
                  </a>
                );
              }

              return (
                <a
                  key={l.label}
                  href={l.hash}
                  className="text-xs uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors"
                >
                  {l.label}
                </a>
              );
            }

            if (l.label === "HOME") {
              return (
                <Link
                  key={l.label}
                  to="/"
                  onClick={() => {
                    // After route change, ensure we land at the very top.
                    setTimeout(scrollToTop, 0);
                  }}
                  className="text-xs uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors"
                >
                  {l.label}
                </Link>
              );
            }

            return (
              <Link
                key={l.label}
                to={`/${l.hash}`}
                className="text-xs uppercase tracking-[0.2em] text-white hover:text-amber-500 transition-colors"
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA / Mobile hamburger */}
        <div className="flex items-center justify-end gap-4">
          {isHome ? (
            <a
              href="#pricing"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
            >
              BOOK NOW
            </a>
          ) : (
            <Link
              to="/#pricing"
              className="hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
            >
              BOOK NOW
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center justify-center text-amber-500"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-5 right-8">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center text-amber-500"
                aria-label="Close menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="h-full flex flex-col items-center justify-center gap-7 px-8">
              {navLinks.map((l) => {
                if ("href" in l) {
                  return (
                    <Link
                      key={l.label}
                      to={l.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm uppercase tracking-[0.25em] text-white hover:text-amber-500 transition-colors"
                    >
                      {l.label}
                    </Link>
                  );
                }

                if (isHome) {
                  if (l.label === "HOME") {
                    return (
                      <a
                        key={l.label}
                        href={l.hash}
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileOpen(false);
                          requestAnimationFrame(() =>
                            requestAnimationFrame(() => scrollToTop())
                          );
                        }}
                        className="text-sm uppercase tracking-[0.25em] text-white hover:text-amber-500 transition-colors"
                      >
                        {l.label}
                      </a>
                    );
                  }

                  return (
                    <a
                      key={l.label}
                      href={l.hash}
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(false);
                        const id = l.hash.replace("#", "");
                        // Wait for overlay/body scroll lock to release.
                        requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
                      }}
                      className="text-sm uppercase tracking-[0.25em] text-white hover:text-amber-500 transition-colors"
                    >
                      {l.label}
                    </a>
                  );
                }

                if (l.label === "HOME") {
                  return (
                    <Link
                      key={l.label}
                      to="/"
                      onClick={() => {
                        setMobileOpen(false);
                        setTimeout(scrollToTop, 0);
                      }}
                      className="text-sm uppercase tracking-[0.25em] text-white hover:text-amber-500 transition-colors"
                    >
                      {l.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={l.label}
                    to={`/${l.hash}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm uppercase tracking-[0.25em] text-white hover:text-amber-500 transition-colors"
                  >
                    {l.label}
                  </Link>
                );
              })}

              {isHome ? (
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    requestAnimationFrame(() =>
                      requestAnimationFrame(() => scrollToId("pricing"))
                    );
                  }}
                  className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
                >
                  BOOK NOW
                </a>
              ) : (
                <Link
                  to="/#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
                >
                  BOOK NOW
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
