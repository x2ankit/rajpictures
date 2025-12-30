import { motion } from "framer-motion";
import { Film, Camera, Video } from "lucide-react";

const services = [
  {
    icon: Film,
    title: "CINEMATIC WEDDINGS",
    description: "We craft cinematic wedding stories with an editorial approach that captures the essence of your special day.",
    button: "Estimate Price",
    accent: "purple"
  },
  {
    icon: Camera,
    title: "STUDIO PORTRAITS", 
    description: "High-end, timeless portraits for brands and personal keepsakes that speak volumes.",
    button: "Estimate Price",
    accent: "orange"
  },
  {
    icon: Video,
    title: "SHOWREEL & MOTION",
    description: "Short films, motion edits & reels that bring your brand story to life with dynamic visuals.",
    button: "Watch Full Showreel",
    accent: "purple"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
  }
};

export const ServicesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-accent tracking-widest">WHAT WE DO</span>
          <h2 className="text-4xl md:text-6xl font-display mt-4">OUR SERVICES</h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="glass-card p-8 group hover:border-primary/50 transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${
                service.accent === "purple" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-accent/20 text-accent"
              }`}>
                <service.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-display mb-4">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {service.description}
              </p>
              
              <button className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                service.accent === "purple"
                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  : "bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
              }`}>
                {service.button}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
