import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const shutterSpeeds = [
  "1/100", "1/125", "1/160", "1/200", "1/250", 
  "1/320", "1/400", "1/500", "1/640", "1/800", "1/1000"
];

const apertures = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8"];

export const ViewfinderOverlay = () => {
  const { scrollYProgress } = useScroll();
  
  // Map scroll to aperture index
  const apertureIndex = useTransform(scrollYProgress, [0, 1], [0, apertures.length - 1]);
  
  // Map scroll to ruler offset
  const rulerX = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4">
        {/* Left: REC indicator and brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-rec" />
            <span className="text-xs font-mono text-red-500 tracking-wider">REC</span>
          </div>
          <span className="text-sm font-display tracking-[0.3em] text-foreground/90">
            CAMERAWALA
          </span>
        </div>

        {/* Right: Dynamic Aperture */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">APERTURE</span>
          <ApertureDisplay progress={apertureIndex} apertures={apertures} />
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="viewfinder-bracket top-12 left-4 border-t-2 border-l-2" />
      <div className="viewfinder-bracket top-12 right-4 border-t-2 border-r-2" />
      <div className="viewfinder-bracket bottom-20 left-4 border-b-2 border-l-2" />
      <div className="viewfinder-bracket bottom-20 right-4 border-b-2 border-r-2" />

      {/* Shutter Speed Ruler - Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 overflow-hidden w-80">
        {/* Red indicator triangle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500" />
        </div>
        
        {/* Ruler */}
        <motion.div 
          className="shutter-ruler pt-3"
          style={{ x: rulerX }}
        >
          {shutterSpeeds.map((speed, i) => (
            <ShutterNumber key={speed} speed={speed} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>
      </div>

      {/* Grid lines (subtle) */}
      <div className="absolute inset-12 border border-white/5" />
      <div className="absolute top-1/2 left-12 right-12 h-px bg-white/5" />
      <div className="absolute left-1/2 top-12 bottom-20 w-px bg-white/5" />
    </div>
  );
};

// Helper component to display current aperture
const ApertureDisplay = ({ 
  progress, 
  apertures 
}: { 
  progress: MotionValue<number>; 
  apertures: string[] 
}) => {
  const currentAperture = useTransform(progress, (v: number) => apertures[Math.round(v)] || apertures[0]);
  
  return (
    <motion.span className="text-lg font-mono text-accent font-bold">
      {currentAperture}
    </motion.span>
  );
};

// Shutter speed number with active state
const ShutterNumber = ({ 
  speed, 
  index, 
  progress 
}: { 
  speed: string; 
  index: number; 
  progress: MotionValue<number>
}) => {
  const color = useTransform(progress, (p: number) => {
    const activeIndex = Math.round(p * (shutterSpeeds.length - 1));
    return activeIndex === index ? "#fff" : "#666";
  });

  const scale = useTransform(progress, (p: number) => {
    const activeIndex = Math.round(p * (shutterSpeeds.length - 1));
    return activeIndex === index ? 1.1 : 1;
  });

  return (
    <motion.span 
      className="shutter-number whitespace-nowrap"
      style={{ color, scale }}
    >
      {speed}
    </motion.span>
  );
};
