import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PortfolioCategory =
  | "Conceptual Shoot"
  | "Pre-wedding Glimpse"
  | "Bridal Specifications"
  | "Wedding Coverage"
  | "Baby Photography";

type PortfolioItemBase = {
  id: number;
  title: string;
  category: PortfolioCategory;
  src: string; // image URL or video thumbnail URL
};

type PortfolioItemVideo = PortfolioItemBase & {
  type: "video";
  youtubeId: string;
};

type PortfolioItemImage = PortfolioItemBase & {
  type: "image";
};

type PortfolioItem = PortfolioItemVideo | PortfolioItemImage;

const categories: PortfolioCategory[] = [
  "Conceptual Shoot",
  "Pre-wedding Glimpse",
  "Bridal Specifications",
  "Wedding Coverage",
  "Baby Photography",
];

const portfolioItems: PortfolioItem[] = [
  // Conceptual Shoot (Demo Videos)
  {
    id: 1,
    title: "Concept Reel",
    category: "Conceptual Shoot",
    type: "video",
    youtubeId: "TwMCmySarVE",
    src: "https://img.youtube.com/vi/TwMCmySarVE/maxresdefault.jpg",
  },
  {
    id: 2,
    title: "Studio Concept",
    category: "Conceptual Shoot",
    type: "image",
    src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1400&q=80",
  },

  // Pre-wedding Glimpse
  {
    id: 3,
    title: "Piya O re Piya",
    category: "Pre-wedding Glimpse",
    type: "video",
    youtubeId: "IzMYRsvaRes",
    src: "https://img.youtube.com/vi/IzMYRsvaRes/maxresdefault.jpg",
  },
  {
    id: 4,
    title: "Sunset Glimpse",
    category: "Pre-wedding Glimpse",
    type: "image",
    src: "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?auto=format&fit=crop&w=1400&q=80",
  },

  // Bridal Specifications
  {
    id: 5,
    title: "Bridal Portrait",
    category: "Bridal Specifications",
    type: "image",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 6,
    title: "Makeover Cinematic",
    category: "Bridal Specifications",
    type: "video",
    youtubeId: "QwFyIOTIE8o",
    src: "https://img.youtube.com/vi/QwFyIOTIE8o/maxresdefault.jpg",
  },

  // Wedding Coverage
  {
    id: 7,
    title: "Wedding Highlights",
    category: "Wedding Coverage",
    type: "video",
    youtubeId: "TlbZJj_9_xY",
    src: "https://img.youtube.com/vi/TlbZJj_9_xY/maxresdefault.jpg",
  },
  {
    id: 8,
    title: "Ritual Moments",
    category: "Wedding Coverage",
    type: "image",
    src: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=1400&q=80",
  },

  // Baby Photography
  {
    id: 9,
    title: "Baby Smiles",
    category: "Baby Photography",
    type: "image",
    src: "https://images.unsplash.com/photo-1542728928-1411f8d3ad43?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: 10,
    title: "Baby Moments",
    category: "Baby Photography",
    type: "video",
    youtubeId: "dQw4w9WgXcQ",
    src: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>(
    categories[0]
  );
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const visibleItems = useMemo(() => {
    return portfolioItems.filter((it) => it.category === activeCategory);
  }, [activeCategory]);

  const close = () => setSelected(null);

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
            {categories.map((cat) => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="group text-left rounded-xl border border-zinc-800 overflow-hidden bg-black/40 hover:border-amber-500/40 transition-colors"
            >
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />

                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl shadow-black/50">
                      <Play className="h-5 w-5 fill-black" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute left-0 right-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-sm font-display tracking-wider text-white">
                    {item.title}
                  </div>
                  <div className="mt-1 text-[10px] font-mono tracking-widest text-zinc-400">
                    {item.category}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

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

      <Dialog open={!!selected} onOpenChange={(open) => (open ? undefined : close())}>
        <DialogContent className="max-w-4xl bg-black border border-zinc-800 p-0 overflow-hidden">
          {selected && (
            <>
              <DialogHeader className="px-5 pt-5">
                <DialogTitle className="text-white font-serifDisplay tracking-tight">
                  {selected.title}
                </DialogTitle>
                <div className="text-xs text-zinc-500 font-body tracking-widest uppercase">
                  {selected.category}
                </div>
              </DialogHeader>

              <div className="px-5 pb-5">
                {selected.type === "video" ? (
                  <div className="mt-4 w-full aspect-video rounded-lg overflow-hidden border border-zinc-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0&showinfo=0&autoplay=1&mute=1`}
                      title={selected.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="mt-4 w-full rounded-lg overflow-hidden border border-zinc-800 bg-black">
                    <img
                      src={selected.src}
                      alt={selected.title}
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
