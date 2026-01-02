import { supabase } from "@/lib/supabaseClient";
import { Aperture, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) navigate("/admin/dashboard", { replace: true });
    };

    void run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin/dashboard", { replace: true });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async () => {
    // 1. Detect where we are (e.g., "http://localhost:8080" or "https://myapp.vercel.app")
    const origin = window.location.origin;

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // 2. Tell Supabase to send us back to the dashboard on THIS same site
        redirectTo: `${origin}/admin/dashboard`,
      },
    });

    if (error) {
      console.error("Login error:", error);
      alert(error.message);
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
                <span className="text-white">Raj</span>{" "}
                <span className="text-amber-500">Pictures</span>
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
              Sign in with your Google account to continue.
            </p>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="mt-8 flex items-center justify-center gap-3 w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <span>Sign in with Google</span>
              )}
            </button>

            <div className="mt-6 text-xs text-zinc-500">
              You will be redirected back to the dashboard after login.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
