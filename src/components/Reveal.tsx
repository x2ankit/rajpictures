import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = MotionProps & {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 70, damping: 20, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
