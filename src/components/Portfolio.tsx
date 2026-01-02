import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const CATEGORY_TABS = [
  "All",
  "Wedding",
  "Pre-wedding",
  "Bridal",
  "Baby",
  "Ring Ceremony",
  "Conceptual",
] as const;

type CategoryTab = (typeof CATEGORY_TABS)[number];

type PortfolioItemRow = {
  id: number;
  category: string | null;
  src: string;
  title: string | null;
  type: string | null;
  created_at?: string;
  sort_order?: number | null;
};

function isMissingCreatedAtError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.toLowerCase().includes("created_at") && message.toLowerCase().includes("exist");
}

function isMissingSortOrderError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return message.toLowerCase().includes("sort_order") && message.toLowerCase().includes("exist");
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("All");
  const [items, setItems] = useState<PortfolioItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("portfolio_items")
          .select("id, category, src, title, type, created_at, sort_order")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false })
          .order("id", { ascending: false });

        if (error) throw error;
        if (!cancelled) setItems((data as PortfolioItemRow[]) || []);
      } catch (err: unknown) {
        // Fallback if created_at or sort_order doesn't exist.
        if (isMissingCreatedAtError(err) || isMissingSortOrderError(err)) {
          const { data, error } = await supabase
            .from("portfolio_items")
            .select("id, category, src, title, type")
            .order("id", { ascending: false });
          if (!error && !cancelled) setItems((data as PortfolioItemRow[]) || []);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (activeCategory === "All") return items;
    return items.filter((it) => (it.category || "") === activeCategory);
  }, [activeCategory, items]);

  return (
    <section className="relative">
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
            CATEGORIES
          </div>
        </motion.div>

        {/* Category tabs */}
        <div className="mb-10 overflow-x-auto">
          <div className="min-w-max flex items-center gap-6 border-b border-white/5">
            {CATEGORY_TABS.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={
                    "pb-3 text-xs md:text-sm uppercase tracking-[0.25em] transition-colors whitespace-nowrap " +
                    (active
                      ? "text-amber-500 border-b-2 border-amber-500"
                      : "text-zinc-400 hover:text-white border-b-2 border-transparent")
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {isLoading || visibleItems.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-zinc-800 bg-black/40 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-zinc-900/40 animate-pulse" />
                <div className="p-4">
                  <div className="h-3 w-2/3 bg-zinc-800/60 rounded animate-pulse" />
                  <div className="mt-3 h-2 w-1/3 bg-zinc-800/40 rounded animate-pulse" />
                </div>
              </div>
            ))}
            <div className="md:col-span-3 text-center text-sm text-zinc-500 mt-2">
              {isLoading ? "Loading Gallery..." : "Loading Gallery..."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="group text-left rounded-xl border border-zinc-800 overflow-hidden bg-black/40 hover:border-amber-500/40 transition-colors"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title || "Portfolio image"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-sm font-display tracking-wider text-white">
                      {item.title || "Untitled"}
                    </div>
                    <div className="mt-1 text-[10px] font-mono tracking-widest text-zinc-400">
                      {item.category || "Uncategorized"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/gallery"
            className="group flex items-center gap-3 px-8 py-3 border border-zinc-700 rounded-full text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
          >
            <span className="text-sm font-medium tracking-[0.2em] uppercase">
              VIEW ARCHIVE
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
