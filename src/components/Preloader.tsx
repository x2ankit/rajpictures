import { useEffect, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          window.setTimeout(() => {
            setIsVisible(false);
            onComplete();
          }, 200);
          return 100;
        }

        return prev + (prev < 70 ? 2 : 5);
      });
    }, 20);

    return () => window.clearInterval(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center text-white"
      aria-label="Loading"
    >
      <h1 className="text-4xl font-bold text-amber-500">{progress}%</h1>
    </div>
  );
}
