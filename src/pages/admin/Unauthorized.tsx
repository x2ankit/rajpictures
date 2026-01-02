import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  const onReturnHome = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center"
      >
        <motion.div
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10"
        >
          <ShieldX className="h-7 w-7 text-red-400" />
        </motion.div>

        <div className="mt-6 text-[11px] uppercase tracking-[0.45em] text-amber-500">
          Security Notice
        </div>
        <h1 className="mt-3 text-3xl font-serifDisplay tracking-[0.18em]">
          <span className="text-red-400">ACCESS</span>{" "}
          <span className="text-amber-500">DENIED</span>
        </h1>

        <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
          Admin access is not associated with this email.
        </p>

        <button
          type="button"
          onClick={onReturnHome}
          className="mt-8 w-full rounded-md bg-amber-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black hover:bg-amber-400 transition-colors"
        >
          Return to Home
        </button>

        <div className="mt-4 text-xs text-zinc-500">
          You will be signed out for safety.
        </div>
      </motion.div>
    </div>
  );
}
