import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, type GalleryItem } from "@/lib/supabaseClient";

const filters = ["All", "Weddings", "Cinematic"] as const;
type Filter = (typeof filters)[number];

async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("id, created_at, title, category, image_url, storage_path")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GalleryItem[]) || [];
}

export const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { stiffness: 420, damping: 38, mass: 0.5 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 420, damping: 38, mass: 0.5 });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = data ?? [];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return items;
    return items.filter((img) => (img.category || "").toLowerCase() === activeFilter.toLowerCase());
  }, [items, activeFilter]);

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load gallery";
    toast({ title: "Gallery error", description: message, variant: "destructive" });
  }

  return (
    <section className="py-28 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Magnetic cursor */}
        <AnimatePresence>
          {isHoveringImage && (
            <motion.div
              className="pointer-events-none fixed left-0 top-0 z-[60] -translate-x-1/2 -translate-y-1/2 will-change-transform"
              style={{ x: cursorXSpring, y: cursorYSpring }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-16 h-16 rounded-full bg-background/35 border border-border/60 backdrop-blur-md flex items-center justify-center">
                <span className="text-[10px] font-mono tracking-widest">VIEW</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
            PORTFOLIO
          </h2>
          <div className="mt-4 text-sm md:text-base text-muted-foreground font-mono tracking-widest">
            GALLERY
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === filter 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden break-inside-avoid bg-muted/20 animate-pulse"
                style={{ height: 220 + (i % 3) * 110 }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
            transition={{ layout: { type: "spring", stiffness: 200, damping: 26 } }}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 1 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05, delayChildren: 0.1 },
              },
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((image) => (
                <motion.div
                  key={String(image.id)}
                  layout
                  layoutId={`gallery-${String(image.id)}`}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
                  transition={{ layout: { type: "spring", stiffness: 220, damping: 26 } }}
                  className="group relative glass-card overflow-hidden break-inside-avoid cursor-none will-change-transform"
                  onPointerEnter={() => setIsHoveringImage(true)}
                  onPointerLeave={() => setIsHoveringImage(false)}
                  onPointerMove={(e) => {
                    cursorX.set(e.clientX);
                    cursorY.set(e.clientY);
                  }}
                >
                  <div className="relative">
                    <motion.img
                      src={image.image_url}
                      alt={image.title || "CameraWala photo"}
                      loading="lazy"
                      className="w-full h-auto object-cover block will-change-transform"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* View indicator (plus icon) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-background/30 border border-border/50 backdrop-blur-md flex items-center justify-center">
                        <Plus className="w-5 h-5 text-foreground" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-sm font-display tracking-wider">
                        {(image.title && image.title.trim()) || "(Untitled)"}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400 tracking-widest">
                        {(image.category && image.category.trim()) || "Uncategorized"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="glass-card p-10 text-center">
                <div className="text-sm text-muted-foreground">No images in this category yet.</div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
};
