import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "Pre Wedding / Wedding Shoot",
    description: "Romantic, cinematic captures that tell the couple’s story."
  },
  {
    number: "02",
    title: "Maternity Photography",
    description: "Soft, emotive portraits celebrating parenthood."
  },
  {
    number: "03",
    title: "Newborn Photography",
    description: "Tender, detail-forward newborn portraits."
  },
  {
    number: "04",
    title: "Kids Photography",
    description: "Playful, story-filled sessions."
  },
  {
    number: "05",
    title: "Pre Birthday Photography",
    description: "Vivid, joyful portraits."
  },
  {
    number: "06",
    title: "Fashion & Commercial",
    description: "High-concept visuals for brands."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  }
};

export const ServicesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-muted-foreground tracking-widest">SERVICES</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display mt-4 leading-tight">
            A Few Words About<br />
            <span className="text-gradient-purple">What I Do</span>
          </h2>
        </motion.div>

        <motion.div 
          className="space-y-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              variants={itemVariants}
              className="group border-b border-border/30 py-8 first:border-t"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                {/* Number */}
                <span className="text-4xl md:text-5xl font-display text-muted-foreground/30 group-hover:text-primary/50 transition-colors duration-300">
                  #{service.number}
                </span>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-display mb-2 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                    {service.description}
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/50 rounded-full hover:border-primary/50 transition-all duration-300 flex items-center gap-2">
                    Learn More
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button className="px-4 py-2 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    Pricing
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
