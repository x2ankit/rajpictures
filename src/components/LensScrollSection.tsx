import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const LENS_VIDEO_URL =
  "https://ftadonqbzirhllyufnjs.supabase.co/storage/v1/object/public/portfolio/hero/Sony%20camera%20lens%20360%20view%20-%20David%20Emil%20(1080p,%20h264).mp4";

export const LensScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);

  return (
    <section ref={sectionRef} className="relative min-h-[95vh] bg-black overflow-hidden -mt-1">
      {/* Top fade connector to blend with previous section */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-black z-20 pointer-events-none"
      />

      {/* Full-bleed floating lens video */}
      <motion.video
        className="absolute inset-0 h-full w-full object-cover opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        src={LENS_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        style={{ rotate, scale, transformOrigin: "50% 50%" }}
      />

      {/* Vignette + contrast layers */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,rgba(0,0,0,0)_55%)]" />

      {/* Subtle cinematic UI so the section isn't empty */}
      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
          <div className="min-w-0">
            <p className="text-amber-500 text-xs uppercase tracking-[0.35em]">Lens Study</p>
            <h2 className="mt-4 font-serifDisplay text-4xl md:text-6xl text-white tracking-tight">
              360° Lens Motion
            </h2>
            <p className="mt-5 text-white/70 font-body text-base md:text-lg leading-relaxed max-w-xl">
              A cinematic lens rotation captured in motion — scroll to see the background turn and breathe.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-16 bg-amber-500/70" />
              <div className="text-xs font-body uppercase tracking-[0.25em] text-white/60">
                Scroll Driven
              </div>
            </div>
          </div>

          <div className="md:text-right">
            <div className="inline-flex flex-col items-start md:items-end gap-2 bg-black/25 border border-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="text-xs font-body uppercase tracking-[0.25em] text-white/70">Specs</div>
              <div className="text-sm text-white/70">1080p • H.264 • Loop</div>
              <div className="text-sm text-white/60">Opacity + Vignette</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edge fade to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
};
