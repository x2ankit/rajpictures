import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, type GalleryItem } from "@/lib/supabaseClient";
import { Image as ImageIcon } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("id, created_at, title, category, image_url")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!isMounted) return;
        const safe = ((data as GalleryItem[]) || []).filter((row) =>
          Boolean(row?.image_url && String(row.image_url).trim())
        );
        setImages(safe);
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
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
          Visual <span className="text-amber-500">Archive</span>
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
        <p className="text-zinc-400 max-w-xl mx-auto">
          A curated selection from our database.
        </p>
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/10"
            >
              <img
                src={image.image_url}
                alt={image.category || image.title || "Gallery Image"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-amber-500/50 rounded-lg">
                <span className="text-amber-500 tracking-widest uppercase text-xs font-bold mb-2">
                  {(image.category || "Gallery").toString()}
                </span>
                <a
                  href={image.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white text-sm border border-white/30 px-6 py-2 rounded-full hover:bg-amber-500 hover:border-amber-500 transition-all"
                >
                  View Full
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
