import { Aperture } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-sm border-b border-white/10">
      <div className="w-full flex justify-between items-center px-6 md:px-12 lg:px-24 py-6">
        <a
          href="#"
          className="flex items-center gap-2"
        >
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <Aperture className="h-5 w-5 text-amber-500" />
          </span>
          <span className="flex flex-col items-start justify-center -mt-1">
            <span className="font-serif text-2xl font-bold text-white leading-none">
              <span className="text-white">Raj</span> <span className="text-amber-500">Pictures</span>
            </span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-zinc-400 font-medium leading-tight">
              CINEMATIC VISUALS
            </span>
          </span>
        </a>
        <div className="flex items-center gap-5">
          <a
            href="#contact"
            className="text-xs uppercase tracking-[0.35em] text-zinc-300 hover:text-amber-500 transition-colors font-display"
          >
            CONTACT
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-5 py-2 rounded-sm bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95"
          >
            BOOK NOW
          </a>
        </div>
      </div>
    </header>
  );
};
