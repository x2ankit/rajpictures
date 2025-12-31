import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const PRIMARY_PHONE_DISPLAY = "+91 93375 64186";
const SECONDARY_PHONE_DISPLAY = "+91 94377 50574";
const PRIMARY_PHONE_TEL = "+919337564186";
const SECONDARY_PHONE_TEL = "+919437750574";
const CONTACT_EMAIL = "book@camerawala.com";
const LOCATION_DISPLAY = "Bhubaneswar, Odisha, India";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-[#130722] to-[#1a0b2e]">
      <div className="mx-auto max-w-6xl px-8 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
          <div className="min-w-0">
              <div className="font-brand text-lg sm:text-xl lg:text-2xl leading-none tracking-tight text-white">
              CAMERA<span className="text-amber-500">WALA</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Capturing timeless moments with artistic vision.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-zinc-400 hover:text-amber-400 transition-all duration-200 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-zinc-400 hover:text-amber-400 transition-all duration-200 hover:scale-110"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-zinc-400 hover:text-amber-400 transition-all duration-200 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="min-w-0">
            <div className="text-amber-500 text-xs font-display uppercase tracking-wider">EXPLORE</div>
            <div className="mt-5 space-y-3 text-sm">
              <Link
                to="/"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Home
              </Link>
              <Link
                to="/#about"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                About
              </Link>
              <Link
                to="/#portfolio"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Portfolio
              </Link>
              <Link
                to="/#films"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Films
              </Link>
              <Link
                to="/#contact"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="min-w-0">
            <div className="text-amber-500 text-xs font-display uppercase tracking-wider">SERVICES</div>
            <div className="mt-5 space-y-3 text-sm">
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Wedding Photography
              </Link>
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Pre-Wedding Shoots
              </Link>
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Cinematic Wedding Films
              </Link>
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Premium Album Designing
              </Link>
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Trendy Instagram Reels
              </Link>
              <Link
                to="/#services"
                className="block text-zinc-400 hover:text-amber-400 transition-all hover:translate-x-1"
              >
                Baby &amp; Lifestyle Photography
              </Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="min-w-0">
            <div className="text-amber-500 text-xs font-display uppercase tracking-wider">GET IN TOUCH</div>
            <div className="mt-5 space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                <span>{LOCATION_DISPLAY}</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-amber-500" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href={`tel:${PRIMARY_PHONE_TEL}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {PRIMARY_PHONE_DISPLAY}
                  </a>
                  <span className="text-white/10">/</span>
                  <a
                    href={`tel:${SECONDARY_PHONE_TEL}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {SECONDARY_PHONE_DISPLAY}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-amber-500" />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">© 2025 CameraWala. All rights reserved.</div>
          <div className="text-xs text-zinc-400">
            <a href="#" className="hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <span className="mx-2 text-white/10">|</span>
            <a href="#" className="hover:text-amber-400 transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
