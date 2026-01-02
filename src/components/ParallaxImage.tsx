import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactEventHandler } from "react";
import { useRef } from "react";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  intensity?: number;
  loading?: "eager" | "lazy";
  onError?: ReactEventHandler<HTMLImageElement>;
};

export function ParallaxImage({
  src,
  alt,
  className,
  intensity = 18,
  loading = "lazy",
  onError,
}: ParallaxImageProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={cn(className)}
        onError={onError}
      />
    );
  }

  const ref = useRef<HTMLImageElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      loading={loading}
      className={cn("will-change-transform", className)}
      style={{ y }}
      onError={onError}
    />
  );
}
