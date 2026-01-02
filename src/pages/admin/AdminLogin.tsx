import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { Aperture, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) navigate("/admin", { replace: true });
    };

    void run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin", { replace: true });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const onGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      if (authError) throw authError;
      // OAuth redirect will take over.
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Aperture className="h-5 w-5 text-amber-500" />
            </span>
            <div>
              <div className="font-serifDisplay text-xl">
                <span className="text-white">Raj</span> <span className="text-amber-500">Pictures</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.35em] text-zinc-400">
                ADMIN ACCESS
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-500">
              Secure Login
            </div>
            <h1 className="mt-4 font-serifDisplay text-3xl text-white">
              Sign in to continue
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Only whitelisted admin emails are allowed.
            </p>

            {error && (
              <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <motion.button
              type="button"
              onClick={onGoogleLogin}
              disabled={isLoading}
              whileHover={{
                scale: isLoading ? 1 : 1.03,
                boxShadow: isLoading ? "none" : "0px 0px 30px rgba(245, 158, 11, 0.35)",
              }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="mt-8 w-full inline-flex items-center justify-center gap-3 rounded-md bg-amber-500 px-5 py-4 text-xs font-bold uppercase tracking-[0.22em] text-black disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>Continue with Google</>
              )}
            </motion.button>

            <div className="mt-6 text-xs text-zinc-500">
              If you think you should have access, contact the site owner to add your email to the <span className="text-zinc-300">admin_whitelist</span> table.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
