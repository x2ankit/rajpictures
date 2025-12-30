import { AnimatePresence, motion } from "framer-motion";
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
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as GalleryItem[]) || [];
}

export const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

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
                  exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
                  className="group relative glass-card overflow-hidden break-inside-avoid cursor-zoom-in"
                >
                  <div className="relative">
                    <motion.img
                      src={image.image_url}
                      alt={image.title || "CameraWala photo"}
                      loading="lazy"
                      className="w-full h-auto object-cover block"
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
