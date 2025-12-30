import { motion } from "framer-motion";
import { MapPin, ExternalLink, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ArtistSection } from "./ArtistSection";

const budgets = [
  "Below ₹50k",
  "₹50k - 1L",
  "₹1L - 2L",
  "₹2L - 5L",
  "Above ₹5L"
];

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    city: "",
    budget: "",
    requirements: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", mobile: "", city: "", budget: "", requirements: "" });
  };

  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=B%2F24+2nd+floor+Siddhi+Vihar+Krishna+garden+Jagamara+Bhubaneswar+Odisha+751030";

  return (
    <section className="py-24 px-6" id="contact">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
            GET IN TOUCH
          </h2>
          <div className="mt-4 text-sm md:text-base text-muted-foreground font-mono tracking-widest">
            LET'S WORK TOGETHER
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Artist Profile - Shows first on mobile */}
          <div className="lg:order-3">
            <ArtistSection />
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:order-1"
          >
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Your mobile number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  City
                </label>
                <input
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                  placeholder="Your city"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Budget
                </label>
                <select
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none text-sm"
                >
                  <option value="">Select your budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Requirements
                </label>
                <textarea
                  required
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm min-h-[120px]"
                  placeholder="Tell us what you need (date, location, style, references)"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-lg hover:bg-primary/90 transition-all glow-purple"
                whileHover={{ scale: 1.05, boxShadow: "var(--shadow-glow-purple)" }}
                whileTap={{ scale: 0.95 }}
              >
                SEND INQUIRY
              </motion.button>
            </form>
          </motion.div>

          {/* Location & Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 lg:order-2"
          >
            {/* Location Card */}
            <div className="glass-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-display mb-1">STUDIO LOCATION</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    B/24 2nd floor, Siddhi Vihar,<br />
                    Krishna garden, Jagamara,<br />
                    Bhubaneswar, Odisha 751030
                  </p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-all text-sm strike-link"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Details */}
            <div className="glass-card p-6 space-y-3">
              <a 
                href="tel:+919937125551" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="font-mono text-sm">+91 9937125551</span>
              </a>
              <a 
                href="mailto:camerawala@gmail.com" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="font-mono text-sm">camerawala@gmail.com</span>
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-4 text-center">
                <span className="text-2xl font-display text-primary">500+</span>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
              <div className="glass-card p-4 text-center">
                <span className="text-2xl font-display text-accent">10+</span>
                <p className="text-xs text-muted-foreground mt-1">Years</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
