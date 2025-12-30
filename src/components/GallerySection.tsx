import { motion } from "framer-motion";
import { useState } from "react";
import { Image } from "lucide-react";

const filters = ["All", "Weddings", "Cinematic"];

// Placeholder images for demo - will be replaced with Supabase storage
const placeholderImages = [
  { id: 1, category: "Weddings", aspect: "portrait" },
  { id: 2, category: "Cinematic", aspect: "landscape" },
  { id: 3, category: "Weddings", aspect: "square" },
  { id: 4, category: "Cinematic", aspect: "portrait" },
  { id: 5, category: "Weddings", aspect: "landscape" },
  { id: 6, category: "Cinematic", aspect: "square" },
];

export const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredImages = activeFilter === "All" 
    ? placeholderImages 
    : placeholderImages.filter(img => img.category === activeFilter);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-mono text-primary tracking-widest">PORTFOLIO</span>
          <h2 className="text-4xl md:text-6xl font-display mt-4">GALLERY</h2>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div 
          className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
          layout
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card overflow-hidden break-inside-avoid ${
                image.aspect === "portrait" ? "aspect-[3/4]" :
                image.aspect === "landscape" ? "aspect-[4/3]" :
                "aspect-square"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground font-mono">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Admin hint */}
        <motion.p 
          className="text-center text-muted-foreground text-sm mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Gallery images managed via <span className="text-primary font-mono">/admin</span>
        </motion.p>
      </div>
    </section>
  );
};
