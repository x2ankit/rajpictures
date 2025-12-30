import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    title: "What makes us different?",
    lens: "f/1.8 24mm",
    content: "We blend cinematic storytelling with editorial precision. Every project is approached as a unique visual narrative, not just a job. Our team brings years of film production experience to ensure your story is told with the depth and emotion it deserves."
  },
  {
    title: "Custom visual creation?",
    lens: "f/2.8 50mm",
    content: "Absolutely. We work closely with you from concept to final delivery. Whether it's a specific mood, color palette, or narrative style, we tailor every aspect of production to match your vision. Our custom packages ensure you get exactly what you need."
  },
  {
    title: "Design and development?",
    lens: "f/4 85mm",
    content: "Beyond photography and videography, we offer complete brand visual development. This includes mood boards, style guides, and comprehensive visual strategies that ensure consistency across all your media touchpoints."
  }
];

export const AccordionSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-accent tracking-widest">FAQ</span>
          <h2 className="text-4xl md:text-6xl font-display mt-4">THROUGH THE LENS</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-card border-border/50 px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="text-lg md:text-xl font-display text-left">
                      {item.title}
                    </span>
                    <span className="text-sm font-mono text-primary hidden sm:block">
                      {item.lens}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 text-sm md:text-base leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
