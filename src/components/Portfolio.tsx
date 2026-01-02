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

  const filteredData = useMemo(() => {
    if (activeCategory === "All") {
      // Only show top 12 for "All" (newest first)
      return items.slice(0, 12);
    }

    // Show everything for categories, ordered by sort_order (then newest)
    return items
      .filter((it) => (it.category || "") === activeCategory)
      .slice()
      .sort((a, b) => {
        const ao = typeof a.sort_order === "number" ? a.sort_order : 0;
        const bo = typeof b.sort_order === "number" ? b.sort_order : 0;
        if (ao !== bo) return ao - bo;

        const ad = a.created_at ? Date.parse(a.created_at) : 0;
        const bd = b.created_at ? Date.parse(b.created_at) : 0;
        if (ad !== bd) return bd - ad;

        return b.id - a.id;
      });
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
        {isLoading ? (
          <div className="text-center py-16 text-zinc-500 text-sm tracking-widest">
            Loading highlights...
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="group text-left rounded-xl border border-zinc-800 overflow-hidden bg-transparent hover:border-amber-500/40 transition-colors"
              >
                <div className="relative aspect-[4/3] bg-transparent overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.category || "Portfolio image"}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold">
                      {item.category || "Uncategorized"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 text-sm tracking-widest italic">
            No images in this collection yet.
          </div>
        )}

        {/* "View Archive" button (only on All tab) */}
        {activeCategory === "All" && !isLoading && (
          <div className="mt-12 flex justify-center">
            <Link
              to="/gallery"
              className="group flex items-center gap-3 px-8 py-3 border border-zinc-700 rounded-full text-zinc-400 hover:text-amber-500 hover:border-amber-500 transition-all duration-300"
            >
              <span className="text-sm font-medium tracking-[0.2em] uppercase">
                VIEW FULL ARCHIVE
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
