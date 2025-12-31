import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase, type GalleryItem } from "@/lib/supabaseClient";

const PAGE_SIZE = 24;

type FilterKey = "All" | "Wedding" | "Commercial" | "Portraits" | "Films";

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "All", label: "ALL" },
  { key: "Wedding", label: "WEDDING" },
  { key: "Commercial", label: "COMMERCIAL" },
  { key: "Portraits", label: "PORTRAITS" },
  { key: "Films", label: "FILMS" },
];

function normalizeCategory(category: string | null | undefined): string {
  return (category || "").trim().toLowerCase();
}

function categoryMatches(filter: FilterKey, category: string | null | undefined): boolean {
  if (filter === "All") return true;
  const c = normalizeCategory(category);
  if (!c) return false;

  if (filter === "Wedding") return c.includes("wedding");
  if (filter === "Commercial") return c.includes("commercial");
  if (filter === "Portraits") return c.includes("portrait");
  if (filter === "Films") return c.includes("film") || c.includes("cinematic");
  return true;
}

function isVideoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov") || u.endsWith(".m4v");
}

function isMissingOrderIndexColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("order_index") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find") ||
      lower.includes("unknown column") ||
      (lower.includes("column") && lower.includes("not") && lower.includes("exist")))
  );
}

async function fetchGalleryPage(params: { page: number; filter: FilterKey }): Promise<GalleryItem[]> {
  const from = params.page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("gallery")
    .select("id, created_at, title, category, image_url, storage_path")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.filter !== "All") {
    // Server-side best-effort filtering.
    const key = params.filter.toLowerCase();
    query = query.ilike("category", `%${key}%`);
  }

  const { data, error } = await query;

  if (!error) return (data as GalleryItem[]) || [];

  if (isMissingOrderIndexColumnError(error)) {
    let fallback = supabase
      .from("gallery")
      .select("id, created_at, title, category, image_url, storage_path")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params.filter !== "All") {
      const key = params.filter.toLowerCase();
      fallback = fallback.ilike("category", `%${key}%`);
    }

    const { data: fallbackData, error: fallbackError } = await fallback;
    if (fallbackError) throw fallbackError;
    return (fallbackData as GalleryItem[]) || [];
  }

  throw error;
}

export default function FullGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = useInfiniteQuery({
    queryKey: ["full-gallery", activeFilter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchGalleryPage({ page: pageParam, filter: activeFilter }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const flatItems = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const all = pages.flat();
    // In case the DB categories don't match the sticky filter options exactly,
    // do a client-side match as well.
    return all.filter((it) => categoryMatches(activeFilter, it.category));
  }, [query.data, activeFilter]);

  const lightboxItem = lightboxIndex === null ? null : flatItems[lightboxIndex] || null;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (query.hasNextPage && !query.isFetchingNextPage) {
          void query.fetchNextPage();
        }
      },
      { root: null, rootMargin: "600px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => {
          if (prev === null) return prev;
          return Math.min(flatItems.length - 1, prev + 1);
        });
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => {
          if (prev === null) return prev;
          return Math.max(0, prev - 1);
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, flatItems.length]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
          <div className="text-sm md:text-base uppercase tracking-[0.35em] font-body text-foreground/80">
            GALLERY
          </div>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  itemsContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={
                  "px-3 py-2 text-[11px] md:text-xs uppercase tracking-[0.25em] font-body transition-colors rounded-full " +
                  (activeFilter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section ref={itemsContainerRef} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
              FULL ARCHIVE
            </h1>
            <div className="mt-3 text-sm md:text-base text-muted-foreground font-body tracking-widest">
              200+ ASSETS • LAZY LOADED
            </div>
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            transition={{ layout: { type: "spring", stiffness: 220, damping: 28 } }}
          >
            {flatItems.map((item, index) => {
              const isVideo = isVideoUrl(item.image_url);

              return (
                <motion.button
                  key={String(item.id)}
                  layout
                  onClick={() => setLightboxIndex(index)}
                  className="group glass-card overflow-hidden text-left cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="relative aspect-[4/5] bg-black">
                    {isVideo ? (
                      <video
                        src={item.image_url}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
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
                      <img
                        src={item.image_url}
                        alt={item.title || "Raj Photography asset"}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute left-0 right-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="text-xs font-display tracking-wider">
                        {(item.title && item.title.trim()) || "(Untitled)"}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground tracking-widest">
                        {(item.category && item.category.trim()) || "Uncategorized"}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          <div ref={sentinelRef} className="h-12" />

          {query.isFetchingNextPage && (
            <div className="mt-6 text-center text-xs font-mono text-muted-foreground tracking-widest">
              LOADING MORE…
            </div>
          )}

          {!query.isLoading && flatItems.length === 0 && (
            <div className="glass-card p-10 text-center mt-8">
              <div className="text-sm text-muted-foreground">No assets found for this filter.</div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/95"
              onClick={() => setLightboxIndex(null)}
            />

            <motion.div
              className="absolute inset-0 flex items-center justify-center p-6"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) {
                    setLightboxIndex((prev) => {
                      if (prev === null) return prev;
                      return Math.min(flatItems.length - 1, prev + 1);
                    });
                    return;
                  }
                  if (info.offset.x > 80) {
                    setLightboxIndex((prev) => {
                      if (prev === null) return prev;
                      return Math.max(0, prev - 1);
                    });
                  }
                }}
                className="relative w-full max-w-6xl"
              >
                <div className="glass-strong overflow-hidden rounded-xl border border-border/60">
                  <div className="relative bg-black">
                    {isVideoUrl(lightboxItem.image_url) ? (
                      <video
                        src={lightboxItem.image_url}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="w-full max-h-[84vh] object-contain"
                      />
                    ) : (
                      <img
                        src={lightboxItem.image_url}
                        alt={lightboxItem.title || "Raj Photography asset"}
                        className="w-full max-h-[84vh] object-contain"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between px-5 py-4 border-t border-border/50">
                    <div className="text-xs font-mono text-muted-foreground tracking-widest">
                      {String(lightboxIndex + 1).padStart(3, "0")} / {String(flatItems.length).padStart(3, "0")}
                    </div>
                    <div className="text-xs font-display tracking-wider text-foreground/80">
                      {(lightboxItem.title && lightboxItem.title.trim()) || "(Untitled)"}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground tracking-widest">
                      {(lightboxItem.category && lightboxItem.category.trim()) || "Uncategorized"}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => {
                        if (prev === null) return prev;
                        return Math.max(0, prev - 1);
                      });
                    }}
                    className="pointer-events-auto px-4 py-6 text-xs font-mono tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                  >
                    PREV
                  </button>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((prev) => {
                        if (prev === null) return prev;
                        return Math.min(flatItems.length - 1, prev + 1);
                      });
                    }}
                    className="pointer-events-auto px-4 py-6 text-xs font-mono tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                  >
                    NEXT
                  </button>
                </div>

                <div className="absolute -top-12 right-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(null);
                    }}
                    className="pointer-events-auto text-xs font-mono tracking-widest text-foreground/70 hover:text-foreground transition-colors"
                  >
                    CLOSE
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
