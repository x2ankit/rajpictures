import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, type GalleryItem } from "@/lib/supabaseClient";
import { ParallaxImage } from "@/components/ParallaxImage";

type Tab = "STILLS" | "MOTION";

function isMissingOrderIndexColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("order_index") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find") ||
      lower.includes("unknown column") ||
      lower.includes("column") && lower.includes("not") && lower.includes("exist"))
  );
}

async function fetchGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("id, created_at, title, category, image_url, storage_path")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(36);

  if (!error) return (data as GalleryItem[]) || [];

  if (isMissingOrderIndexColumnError(error)) {
    const fallback = await supabase
      .from("gallery")
      .select("id, created_at, title, category, image_url, storage_path")
      .order("created_at", { ascending: false })
      .limit(36);

    if (fallback.error) throw fallback.error;
    return (fallback.data as GalleryItem[]) || [];
  }

  throw error;
}

function isVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov") || u.endsWith(".m4v");
}

export const GallerySection = () => {
  const [activeTab, setActiveTab] = useState<Tab>("STILLS");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const items = data ?? [];

  const visible = useMemo(() => {
    const stills = items.filter((it) => !isVideoUrl(it.image_url));
    const motion = items.filter((it) => isVideoUrl(it.image_url));
    const next = activeTab === "STILLS" ? stills : motion;
    return next.slice(0, 12);
  }, [items, activeTab]);

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load gallery";
    toast({ title: "Gallery error", description: message, variant: "destructive" });
  }

  return (
    <section className="relative">
      <div id="gallery" className="scroll-mt-28" />
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
            PORTFOLIO
          </h2>
          <div className="mt-4 text-sm md:text-base text-muted-foreground font-body tracking-widest">
            GALLERY
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(["STILLS", "MOTION"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setHoveredId(null);
                setActiveTab(tab);
              }}
              className={
                "px-6 py-2 rounded-full text-xs md:text-sm uppercase tracking-[0.3em] font-body transition-all " +
                (activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden break-inside-avoid bg-muted/20 animate-pulse"
                style={{ height: 220 + (i % 3) * 110 }}
              />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0.2, 1] as const }}
            >
              <motion.div
                layout
                transition={{ layout: { type: "spring", stiffness: 200, damping: 26 } }}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {visible.map((image) => {
                    const id = String(image.id);
                    const dimOthers = hoveredId !== null && hoveredId !== id;
                    const isVideo = isVideoUrl(image.image_url);

                    return (
                      <motion.div
                        key={id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 14 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
                          },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
                        transition={{ layout: { type: "spring", stiffness: 220, damping: 26 } }}
                        className={
                          "group relative glass-card overflow-hidden break-inside-avoid will-change-transform cursor-pointer transition-opacity duration-300 " +
                          (dimOthers ? "opacity-40" : "opacity-100")
                        }
                        onMouseEnter={() => setHoveredId(id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="relative">
                          {isVideo ? (
                            <video
                              src={image.image_url}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              className="w-full h-auto object-cover block will-change-transform"
                              onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                void el.play().catch(() => undefined);
                              }}
                              onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.pause();
                              }}
                            />
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                            >
                              <ParallaxImage
                                src={image.image_url}
                                alt={image.title || "Raj Pictures asset"}
                                loading="lazy"
                                className="w-full h-auto object-cover block"
                                intensity={14}
                              />
                            </motion.div>
                          )}

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
                            <div className="text-[10px] font-mono text-muted-foreground tracking-widest">
                              {(image.category && image.category.trim()) || "Uncategorized"}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {visible.length === 0 && (
                  <div className="glass-card p-10 text-center break-inside-avoid">
                    <div className="text-sm text-muted-foreground">
                      {activeTab === "MOTION" ? "No motion clips added yet." : "No stills added yet."}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
};
