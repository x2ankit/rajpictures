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
      <ParallaxImageMobile
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        onError={onError}
      />
    );
  }

  return (
    <ParallaxImageDesktop
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      intensity={intensity}
      onError={onError}
    />
  );
}

function ParallaxImageMobile({
  src,
  alt,
  className,
  loading,
  onError,
}: Pick<ParallaxImageProps, "src" | "alt" | "className" | "loading" | "onError">) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={cn(className)}
      onError={onError}
    />
  );
}

function ParallaxImageDesktop({
  src,
  alt,
  className,
  intensity,
  loading,
  onError,
}: ParallaxImageProps) {
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
      decoding="async"
      className={cn("will-change-transform", className)}
      style={{ y }}
      onError={onError}
    />
  );
}
