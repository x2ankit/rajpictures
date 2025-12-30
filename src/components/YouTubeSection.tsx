import { motion } from "framer-motion";
import { Play, Circle } from "lucide-react";
import { useState } from "react";

export const YouTubeSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wide font-display text-zinc-200">
            FEATURED WORK
          </h2>
          <div className="mt-4 text-sm md:text-base text-muted-foreground font-mono tracking-widest">
            DIRECTOR'S MONITOR
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Monitor frame */}
          <div className="glass-strong p-3 md:p-4 rounded-xl">
            {/* Monitor header */}
            <div className="flex items-center justify-between px-4 py-2 mb-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Circle className="w-3 h-3 text-red-500 fill-red-500" />
                <Circle className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <Circle className="w-3 h-3 text-green-500 fill-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">PLAYBACK</span>
                <Play className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">1080p 24fps</span>
            </div>

            {/* Video container */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              {isPlaying ? (
                <iframe
                  src="https://www.youtube.com/embed/TlbZJj_9_xY?rel=0&modestbranding=1&autoplay=1"
                  title="CameraWala Cinematic Wedding Highlights"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 w-full h-full group"
                  aria-label="Play video"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-background/25 border border-border/60 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Play className="w-7 h-7 text-foreground" />
                    </div>
                  </div>
                  <div className="absolute left-4 bottom-4 text-left">
                    <div className="text-xs font-mono text-zinc-400 tracking-widest">PRESS PLAY</div>
                  </div>
                </button>
              )}
            </div>

            {/* Monitor footer */}
            <div className="flex items-center justify-between px-4 py-2 mt-3 border-t border-border/50">
              <span className="text-xs font-mono text-muted-foreground">TC: 00:00:00:00</span>
              <span className="text-xs font-mono text-accent">WEDDING HIGHLIGHTS</span>
              <span className="text-xs font-mono text-muted-foreground">CLIP 001</span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-muted rounded-full" />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-1 bg-muted/50 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
