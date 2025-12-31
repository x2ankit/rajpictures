export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 bg-black/10 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="#"
          className="text-xs md:text-sm uppercase tracking-[0.35em] text-zinc-200 font-display"
        >
          RAJ PHOTOGRAPHY
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
