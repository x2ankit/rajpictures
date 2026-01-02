import { Aperture, Menu, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type NavbarProps = {
  onOpenPopup: () => void;
};

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/#about" },
  { name: "Services", path: "/#services" },
  { name: "Portfolio", path: "/#portfolio" },
  { name: "Gallery", path: "/gallery" },
  { name: "Films", path: "/#films" },
  { name: "Contact", path: "#contact" },
] as const;

export const Navbar = ({ onOpenPopup }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const scrollToTop = (e?: MouseEvent) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (path: string) => {
    // Always close mobile menu when navigating.
    setMobileOpen(false);

    if (path === "/") {
      if (isHome) {
        scrollToTop();
      } else {
        navigate("/");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      }
      return;
    }

    // "#contact" is requested in the prompt; make it route-aware.
    if (path.startsWith("#")) {
      if (isHome) {
        const el = document.querySelector(path);
        if (el) {
          // Wait for overlay to close + body scroll to unlock.
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              el.scrollIntoView({ behavior: "smooth", block: "start" })
            )
          );
        }
      } else {
        navigate(`/${path}`);
      }
      return;
    }

    navigate(path);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm border-b border-white/10">
      <div className="w-full flex items-center justify-between px-6 md:px-12 lg:px-24 py-6">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              scrollToTop();
            } else {
              setMobileOpen(false);
            }
          }}
          className="flex items-center gap-2"
        >
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Aperture className="h-5 w-5 text-amber-500" />
          </span>
          <span className="flex flex-col items-start justify-center -mt-1">
            <span className="font-serif text-2xl font-bold text-white leading-none">
              <span className="text-white">Raj</span>{" "}
              <span className="text-amber-500">Pictures</span>
            </span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400 font-medium leading-tight">
              CINEMATIC VISUALS
            </span>
          </span>
        </Link>

        {/* Center: Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => {
            // Home uses scroll-to-top logic.
            if (l.path === "/") {
              return (
                <Link
                  key={l.name}
                  to="/"
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault();
                      scrollToTop();
                    }
                  }}
                  className="text-sm font-medium tracking-widest text-zinc-300 hover:text-amber-500 transition-colors uppercase"
                >
                  {l.name}
                </Link>
              );
            }

            // For #contact keep it route-aware.
            if (l.path.startsWith("#")) {
              if (isHome) {
                return (
                  <a
                    key={l.name}
                    href={l.path}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(l.path);
                    }}
                    className="text-sm font-medium tracking-widest text-zinc-300 hover:text-amber-500 transition-colors uppercase"
                  >
                    {l.name}
                  </a>
                );
              }

              return (
                <Link
                  key={l.name}
                  to={`/${l.path}`}
                  className="text-sm font-medium tracking-widest text-zinc-300 hover:text-amber-500 transition-colors uppercase"
                >
                  {l.name}
                </Link>
              );
            }

            return (
              <Link
                key={l.name}
                to={l.path}
                className="text-sm font-medium tracking-widest text-zinc-300 hover:text-amber-500 transition-colors uppercase"
              >
                {l.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenPopup}
            className="inline-flex items-center justify-center px-5 py-2 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
          >
            BOOK NOW
          </button>

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

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-black">
          <div className="absolute top-6 right-6">
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
            {navLinks.map((l) => (
              <button
                key={l.name}
                type="button"
                onClick={() => handleNavClick(l.path)}
                className="text-sm font-medium tracking-widest text-zinc-300 hover:text-amber-500 transition-colors uppercase"
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
