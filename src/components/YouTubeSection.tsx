import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useState } from "react";

type Film = {
  id: number;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail: string;
};

const films: Film[] = [
  {
    id: 1,
    title: "Piya O re Piya",
    category: "Pre-Wedding Cinematic",
    youtubeId: "IzMYRsvaRes",
    thumbnail: "https://img.youtube.com/vi/IzMYRsvaRes/maxresdefault.jpg",
  },
  {
    id: 2,
    title: "Wedding Highlights",
    category: "Signature Film",
    youtubeId: "TlbZJj_9_xY",
    thumbnail: "https://img.youtube.com/vi/TlbZJj_9_xY/maxresdefault.jpg",
  },
  {
    id: 3,
    title: "Featured Film",
    category: "Wedding Teaser",
    youtubeId: "TwMCmySarVE",
    thumbnail: "https://img.youtube.com/vi/TwMCmySarVE/maxresdefault.jpg",
  },
  {
    id: 4,
    title: "Featured Film",
    category: "Wedding Teaser",
    youtubeId: "QwFyIOTIE8o",
    thumbnail: "https://img.youtube.com/vi/QwFyIOTIE8o/maxresdefault.jpg",
  },
];

export const YouTubeSection = () => {
  const [currentFilm, setCurrentFilm] = useState<Film>(films[0]);

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[1920px] px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
              FEATURED WORK
            </h2>
            <div className="mt-4 text-sm md:text-base text-muted-foreground font-body tracking-widest">
              DIRECTOR'S MONITOR
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
          >
            <div className="w-full max-w-6xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative">
              <div className="h-10 bg-zinc-800/80 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>

                <div className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase flex items-center gap-2">
                  <Camera className="w-3 h-3 text-amber-500" />
                  RAJ PICTURES
                </div>

                <div className="text-[10px] font-mono text-zinc-600">
                  4K 60FPS • RAW
                </div>
              </div>

              <iframe
                key={currentFilm.youtubeId}
                src={`https://www.youtube.com/embed/${currentFilm.youtubeId}?rel=0&showinfo=0&autoplay=1&mute=1`}
                title={currentFilm.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full aspect-video"
                loading="lazy"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {films.map((film) => {
                const isActive = film.id === currentFilm.id;
                return (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() => setCurrentFilm(film)}
                    className={
                      "text-left rounded-xl border overflow-hidden transition-colors " +
                      (isActive
                        ? "border-amber-500"
                        : "border-zinc-800 hover:border-amber-500/50")
                    }
                  >
                    <div className="relative aspect-video bg-black">
                      <img
                        src={film.thumbnail}
                        alt={film.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                    <div className="px-3 py-3 bg-black">
                      <div className="text-xs font-semibold text-white line-clamp-1">
                        {film.title}
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-400 line-clamp-1">
                        {film.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
