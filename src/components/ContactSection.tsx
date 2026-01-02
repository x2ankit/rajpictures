import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const budgets = ["Below ₹50k", "₹50k - 1L", "₹1L - 2L", "₹2L - 5L", "Above ₹5L"] as const;
const serviceTypes = [
  "Wedding Photography",
  "Pre-Wedding Shoots",
  "Baby / Maternity",
  "Corporate Events",
  "Drone Coverage",
] as const;

export const ContactSection = () => {
  const primaryPhoneDisplay = "+91 93375 64186";
  const primaryPhoneTel = "+919337564186";
  const secondaryPhoneDisplay = "+91 94377 50574";
  const secondaryPhoneTel = "+919437750574";
  const contactEmail = "patraraj075@gmail.com";
  const locationDisplay = "Bonaigarh, Sundargarh, Odisha, India";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    serviceType: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", mobile: "", serviceType: "", budget: "", message: "" });
  };

  const googleMapsUrl = "https://www.google.com/maps/place/Bonaigarh,+Odisha";

  const inputClassName =
    "bg-transparent border-b border-zinc-700 focus:border-amber-500 text-white placeholder:text-zinc-600 outline-none transition-colors py-4 w-full placeholder:uppercase placeholder:text-xs placeholder:tracking-widest";

  return (
    <section id="contact" className="px-6 py-24 md:py-32 bg-gradient-to-t from-amber-900/20 to-black">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12"
        >
          <p className="text-amber-500 text-xs sm:text-sm uppercase tracking-[0.2em]">WHAT WE CREATE</p>
          <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="font-serifDisplay text-5xl md:text-7xl leading-[1.02] text-white">
              Get In <span className="text-amber-500">Touch</span>
            </h2>
            <p className="font-body text-zinc-400 tracking-[0.08em] max-w-xl">
              Share your date, vision, and style — we’ll reply with availability and a tailored quote.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-white/5">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0, 0.2, 1] }}
            className="relative min-h-[520px] md:min-h-[640px]"
          >
            <img
              src="https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=1000"
              alt="Studio portrait"
              className="absolute inset-0 h-full w-full object-cover grayscale"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 space-y-4">
              <div className="flex items-start gap-3 text-zinc-300">
                <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/70">Studio Location</div>
                  <div className="mt-1 text-sm">Bonaigarh, Odisha</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <Phone className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/70">Phone</div>
                  <a href={`tel:${primaryPhoneTel}`} className="mt-1 block text-sm hover:text-amber-500 transition-colors">
                    {primaryPhoneDisplay}
                  </a>
                  <a href={`tel:${secondaryPhoneTel}`} className="mt-1 block text-sm hover:text-amber-500 transition-colors">
                    {secondaryPhoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-zinc-300">
                <Mail className="mt-0.5 h-4 w-4 text-amber-500" />
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-white/70">Email</div>
                  <a href={`mailto:${contactEmail}`} className="mt-1 block text-sm hover:text-amber-500 transition-colors">
                    {contactEmail}
                  </a>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-amber-500 hover:text-white transition-colors"
              >
                Open in Google Maps <span aria-hidden>↗</span>
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.2, 0, 0.2, 1] }}
            className="bg-black/40 backdrop-blur-3xl p-8 md:p-10"
          >
            <div className="font-serifDisplay text-3xl md:text-4xl text-white">
              Ready to Create <span className="text-amber-500">Magic</span>?
            </div>
            <div className="mt-2 font-body text-zinc-400 tracking-[0.18em] text-xs uppercase">Send an inquiry</div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClassName}
                placeholder="Name"
              />

              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className={inputClassName}
                placeholder="Mobile"
              />

              <select
                required
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                className={
                  inputClassName +
                  " appearance-none text-white/90 [&>option]:text-black"
                }
              >
                <option value="">SERVICE TYPE</option>
                {serviceTypes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className={
                  inputClassName +
                  " appearance-none text-white/90 [&>option]:text-black"
                }
              >
                <option value="">BUDGET</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={inputClassName + " min-h-[140px] resize-none"}
                placeholder="Message"
              />

              <motion.button
                type="submit"
                className="w-full py-4 bg-amber-500 text-black font-bold text-xs uppercase tracking-[0.28em] rounded-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 hover:bg-amber-600"
                whileTap={{ scale: 0.98 }}
              >
                SEND INQUIRY
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
