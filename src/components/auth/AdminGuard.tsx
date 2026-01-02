import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AdminGuardProps = {
  children: ReactNode;
};

type GuardState =
  | { status: "loading" }
  | { status: "allowed" }
  | { status: "denied"; reason?: string };

export default function AdminGuard({ children }: AdminGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, setState] = useState<GuardState>({ status: "loading" });

  const from = useMemo(() => {
    const next = location.pathname + location.search + location.hash;
    return next && next !== "/admin/login" ? next : "/admin";
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setState({ status: "loading" });

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;

      if (error) {
        setState({ status: "denied", reason: error.message });
        return;
      }

      const session = data.session;
      if (!session) {
        navigate(`/admin/login`, { replace: true, state: { from } });
        return;
      }

      const email = session.user.email;
      if (!email) {
        await supabase.auth.signOut();
        setState({ status: "denied", reason: "Missing email on account." });
        return;
      }

      const { data: row, error: whitelistError } = await supabase
        .from("admin_whitelist")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (cancelled) return;

      if (whitelistError) {
        setState({ status: "denied", reason: whitelistError.message });
        return;
      }

      if (!row) {
        await supabase.auth.signOut();
        setState({ status: "denied", reason: "Access denied. Email not whitelisted." });
        return;
      }

      setState({ status: "allowed" });
    };

    void check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void check();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [from, navigate]);

  if (state.status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="inline-flex items-center gap-3 text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
          Checking access...
        </div>
      </div>
    );
  }

  if (state.status === "denied") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-500">Access</div>
          <h1 className="mt-4 font-serifDisplay text-3xl">Access Denied</h1>
          <p className="mt-3 text-sm text-zinc-400">
            {state.reason || "You do not have permission to view this page."}
          </p>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/login", { replace: true })}
              className="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-white/10"
            >
              Go to Login
            </button>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/admin/login", { replace: true });
              }}
              className="flex-1 rounded-md bg-amber-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black hover:bg-amber-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
