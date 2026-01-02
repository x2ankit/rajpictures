import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

type AdminGuardProps = {
  children: ReactNode;
};

const allowedEmail = "x2ankittripathy@gmail.com";

export default function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setLoading(true);

      // If we're returning from Google OAuth (PKCE), Supabase redirects back with ?code=...
      // Exchange it for a real session BEFORE we decide to redirect away.
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError) {
            // Clean the URL so refreshes don't re-trigger exchange.
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch {
        // Ignore and continue to getSession
      }

      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error) {
        setSession(null);
        setLoading(false);
        return;
      }
      setSession(data.session ?? null);
      setLoading(false);
    };

    void check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="inline-flex items-center gap-3 text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  const email = session.user?.email || "";
  if (allowedEmail && email.toLowerCase() !== allowedEmail.toLowerCase()) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  return <>{children}</>;
}
