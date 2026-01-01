import { motion } from "framer-motion";
import { Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const PRIMARY_PHONE_DISPLAY = "+91 93375 64186";
const SECONDARY_PHONE_DISPLAY = "+91 94377 50574";
const PRIMARY_PHONE_TEL = "+919337564186";
const CONTACT_EMAIL = "book@rajpictures.com";
const LOCATION_DISPLAY = "Bonaigarh, Sundargarh, Odisha, India";
const LOCATION_SHORT = "Bonaigarh, Odisha";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, ease: [0.2, 0, 0.2, 1] }}
      className="bg-[#020202]"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
          {/* Column 1: Brand */}
          <div className="min-w-0">
            <div className="font-serifDisplay text-2xl text-white tracking-tight">
              Raj <span className="text-amber-500">Pictures</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed font-body">
              Crafting visual stories that transcend time...
            </p>

            <div className="mt-7 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-zinc-400 hover:text-amber-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-zinc-400 hover:text-amber-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="min-w-0">
            <div className="font-serifDisplay text-white text-sm uppercase tracking-[0.08em]">
              Quick Links
            </div>
            <div className="mt-5 space-y-3 text-sm font-body">
              {[{ to: "/", label: "Home" }, { to: "/#about", label: "About" }, { to: "/#portfolio", label: "Portfolio" }, { to: "/#films", label: "Films" }, { to: "/#contact", label: "Contact" }].map(
                (l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="block text-zinc-400 hover:text-amber-500 transition-all hover:translate-x-1"
                  >
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="min-w-0">
            <div className="font-serifDisplay text-white text-sm uppercase tracking-[0.08em]">
              Services
            </div>
            <div className="mt-5 space-y-3 text-sm font-body">
              {[
                "Wedding Photography",
                "Pre-Wedding Shoots",
                "Baby Photography",
                "Corporate Events",
                "Drone Coverage",
              ].map((s) => (
                <Link
                  key={s}
                  to="/#services"
                  className="block text-zinc-400 hover:text-amber-500 transition-all hover:translate-x-1"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="min-w-0">
            <div className="font-serifDisplay text-white text-sm uppercase tracking-[0.08em]">
              Contact Us
            </div>
            <div className="mt-5 space-y-4 text-sm font-body text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                <span>{LOCATION_SHORT}</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-amber-500" />
                <a href={`tel:${PRIMARY_PHONE_TEL}`} className="hover:text-amber-500 transition-colors">
                  {PRIMARY_PHONE_DISPLAY}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-amber-500" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-amber-500 transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-zinc-600 font-body">© 2025 Raj Pictures. All rights reserved.</div>
          <div className="text-xs text-zinc-600 font-body">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="mx-2 text-white/10">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
