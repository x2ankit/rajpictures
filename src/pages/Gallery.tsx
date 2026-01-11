import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase, type GalleryItem } from "@/lib/supabaseClient";
import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { Seo } from "@/components/Seo";

function isMissingCreatedAtColumnError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();
  return (
    lower.includes("created_at") &&
    (lower.includes("does not exist") ||
      lower.includes("could not find") ||
      lower.includes("unknown column") ||
      (lower.includes("column") && lower.includes("not") && lower.includes("exist")))
  );
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<GalleryItem | null>(null);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Wedding Photography Portfolio | Raj Pictures",
    url: "https://www.rajpictures.in/gallery",
    description:
      "Browse the latest wedding photography, cinematic films, pre-wedding shoots, and candid stories captured by Raj Pictures across Odisha.",
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchGallery() {
      try {
        setLoading(true);

        // Fetch ALL rows from the gallery table.
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Database Error:", error.message);
          if (isMissingCreatedAtColumnError(error)) {
            const { data: fallbackData, error: fallbackError } = await supabase
              .from("gallery")
              .select("*")
              .order("id", { ascending: false });
            if (fallbackError) throw fallbackError;
            if (!isMounted) return;
            console.log("Images found:", (fallbackData as any[])?.length ?? 0);
            setImages(((fallbackData as GalleryItem[]) || []) ?? []);
            return;
          }

          throw error;
        }

        if (!isMounted) return;
        console.log("Images found:", (data as any[])?.length ?? 0);
        setImages(((data as GalleryItem[]) || []) ?? []);
      } catch (error) {
        // Keep UI stable; errors are shown via empty state.
        console.error("Error loading gallery:", error);
        if (!isMounted) return;
        setImages([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    void fetchGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Seo
        title="Portfolio Gallery | Wedding Photography & Films"
        description="View curated weddings, pre-weddings, and cinematic films crafted by Raj Pictures across Odisha. High-resolution images, editorial frames, and cinematic storytelling."
        pathname="/gallery"
        type="website"
        schema={collectionSchema}
      />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-transparent">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4">
          Visual <span className="text-amber-500">Archive</span>
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs">Capturing stories through the lens</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-amber-500">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4" />
          <p className="text-sm tracking-widest uppercase">Fetching Archive...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm">
          <ImageIcon size={48} className="text-zinc-700 mb-4" />
          <h3 className="text-xl font-display text-zinc-500 mb-2">The Gallery is empty</h3>
          <p className="text-zinc-600 text-sm">Raj has not uploaded any pictures yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={String(image.id)}
              onClick={() => setSelectedImg(image)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 cursor-zoom-in"
            >
              <img
                src={image.image_url}
                alt={image.category || image.title || "Gallery image"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) parent.style.display = "none";
                }}
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <Maximize2 className="text-amber-500 mb-2" size={28} />
                <span className="text-amber-500 text-[10px] tracking-[0.3em] uppercase font-bold">
                  {(image.category || "Gallery").toString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Full Screen Lightbox with Smooth Zoom Exit */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[11000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-6 right-6 z-50"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImg(null);
                }}
                className="text-white/70 hover:text-amber-500 transition-colors"
                aria-label="Close"
              >
                <X size={40} />
              </button>
            </motion.div>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImg.image_url}
              alt={selectedImg.category || selectedImg.title || "Selected gallery image"}
              className="max-w-full max-h-[85vh] rounded shadow-2xl object-contain pointer-events-none"
            />

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-6 text-amber-500 text-sm tracking-[0.4em] uppercase font-bold"
            >
              {(selectedImg.category || "Gallery").toString()}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
