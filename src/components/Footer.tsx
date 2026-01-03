import { motion } from "framer-motion";
import { Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const PRIMARY_PHONE_DISPLAY = "+91 93375 64186";
const SECONDARY_PHONE_DISPLAY = "+91 94377 50574";
const PRIMARY_PHONE_TEL = "+919337564186";
const SECONDARY_PHONE_TEL = "+919437750574";
const CONTACT_EMAIL = "support@rajpictures.in";
const LOCATION_DISPLAY = "Bonaigarh, Sundargarh, Odisha, India";
const LOCATION_SHORT = "Bonaigarh, Odisha";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9, ease: [0.2, 0, 0.2, 1] }}
      className="relative bg-transparent pt-20 pb-10 px-6 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <h2 className="text-2xl font-serifDisplay font-bold text-white tracking-tight">
              Raj <span className="text-amber-500">Pictures</span>
            </h2>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mt-1 font-body">
              Cinematic Visuals
            </p>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed font-body">
            Crafting visual stories that transcend time, capturing your most precious moments with artistry and elegance.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/raj_pictures_001/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-zinc-400 hover:text-amber-500 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.youtube.com/channel/UCI7UMjrc6F4fdJHaRQpDb8A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-zinc-400 hover:text-amber-500 transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-sm font-serifDisplay">Quick Links</h3>
          <ul className="space-y-4 text-zinc-400 text-sm font-body">
            <li>
              <Link to="/" className="hover:text-amber-500 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#about" className="hover:text-amber-500 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/#services" className="hover:text-amber-500 transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-amber-500 transition-colors">
                Team
              </Link>
            </li>
            <li>
              <Link to="/#portfolio" className="hover:text-amber-500 transition-colors">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to="/#films" className="hover:text-amber-500 transition-colors">
                Films
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:text-amber-500 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-sm font-serifDisplay">Services</h3>
          <ul className="space-y-4 text-zinc-400 text-sm font-body">
            <li>Wedding Photography</li>
            <li>Pre-Wedding Shoots</li>
            <li>Baby Photography</li>
            <li>Corporate Events</li>
            <li>Drone Coverage</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-bold mb-6 tracking-widest uppercase text-sm font-serifDisplay">Contact Us</h3>
          <ul className="space-y-4 text-zinc-400 text-sm font-body">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-amber-500" />
              <span>{LOCATION_SHORT}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-amber-500" />
              <a href={`tel:${PRIMARY_PHONE_TEL}`} className="hover:text-amber-500 transition-colors">
                {PRIMARY_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-amber-500" />
              <a href={`tel:${SECONDARY_PHONE_TEL}`} className="hover:text-amber-500 transition-colors">
                {SECONDARY_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-amber-500" />
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-amber-500 transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-body">
        <p>© 2025 Raj Pictures. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </motion.footer>
  );
};
