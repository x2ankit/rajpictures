import { motion } from "framer-motion";
import { MapPin, ExternalLink, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const services = [
  "Pre Wedding / Wedding Shoot",
  "Maternity Photography",
  "Newborn Photography",
  "Kids Photography",
  "Pre Birthday Photography",
  "Fashion & Commercial Shoots"
];

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
    email: "",
    service: "",
    budget: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inquiry Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", service: "", budget: "" });
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
          <span className="text-sm font-mono text-primary tracking-widest">GET IN TOUCH</span>
          <h2 className="text-4xl md:text-6xl font-display mt-4">LET'S WORK TOGETHER</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Service
                </label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Budget
                </label>
                <select
                  required
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="">Select your budget</option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground font-display text-lg tracking-wider rounded-lg hover:bg-primary/90 transition-all glow-purple"
              >
                SEND INQUIRY
              </button>
            </form>
          </motion.div>

          {/* Location & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* Location Card */}
            <div className="glass-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-display mb-2">STUDIO LOCATION</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Contact Details */}
            <div className="glass-card p-8 space-y-4">
              <a 
                href="tel:+919937125551" 
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-sm">+91 9937125551</span>
              </a>
              <a 
                href="mailto:thefotowalla@gmail.com" 
                className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-sm">thefotowalla@gmail.com</span>
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center">
                <span className="text-3xl font-display text-primary">500+</span>
                <p className="text-sm text-muted-foreground mt-1">Projects Delivered</p>
              </div>
              <div className="glass-card p-6 text-center">
                <span className="text-3xl font-display text-accent">8+</span>
                <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
