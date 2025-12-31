import { motion } from "framer-motion";
import { Circle, Youtube } from "lucide-react";

function toYouTubeEmbedUrl(videoUrl: string): string {
  try {
    const url = new URL(videoUrl);
    // youtu.be/<id>
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "").trim();
      if (id) return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
    }
    // youtube.com/watch?v=<id>
    const v = url.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
    // already embed
    if (url.pathname.includes("/embed/")) return `${url.origin}${url.pathname}?rel=0&modestbranding=1`;
    return `https://www.youtube.com/embed/TlbZJj_9_xY?rel=0&modestbranding=1`;
  } catch {
    return `https://www.youtube.com/embed/TlbZJj_9_xY?rel=0&modestbranding=1`;
  }
}

export const YouTubeSection = () => {
  const videoUrl = "https://www.youtube.com/watch?v=TlbZJj_9_xY";
  const channelUrl = "https://www.youtube.com/channel/UCI7UMjrc6F4fdJHaRQpDb8A";
  const channelLabel = "CAMERAWALA";
  const embedUrl = toYouTubeEmbedUrl(videoUrl);

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
                <Youtube className="w-4 h-4 text-primary" />
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  {channelLabel}
                </a>
              </div>
              <span className="text-xs font-mono text-muted-foreground">4K 60fps</span>
            </div>

            {/* Video container */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                title="CameraWala Featured Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
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
