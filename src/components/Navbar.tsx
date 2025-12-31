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
        <a
          href="#services"
          className="text-xs uppercase tracking-[0.35em] text-zinc-300 hover:text-white transition-colors font-display"
        >
          MENU
        </a>
      </div>
    </header>
  );
};
