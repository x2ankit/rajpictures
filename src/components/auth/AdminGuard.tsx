import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";

type AdminGuardProps = {
  children: ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // New state for DB check

  useEffect(() => {
    let cancelled = false;

    const checkSessionAndWhitelist = async () => {
      setLoading(true);

      // 1. Handle OAuth Redirect (Keep existing logic)
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (!exchangeError) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch {
        // ignore
      }

      // 2. Get Session
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (cancelled) return;
      
      if (error || !currentSession) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(currentSession);

      // 3. CHECK DATABASE WHITELIST (The Fix)
      // This query checks if the email exists in your table (Case Insensitive)
      const userEmail = currentSession.user?.email;
      
      if (userEmail) {
        const { data } = await supabase
          .from("admin_whitelist")
          .select("email")
          .ilike("email", userEmail) // .ilike ignores Upper/Lower case differences!
          .maybeSingle();

        if (data) {
          setIsAuthorized(true);
        } else {
          console.warn("User not in whitelist:", userEmail);
          setIsAuthorized(false);
        }
      }

      setLoading(false);
    };

    void checkSessionAndWhitelist();

    // 4. Listen for Auth Changes
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession);
      
      if (nextSession?.user?.email) {
         // Re-check whitelist on auth change
         const { data } = await supabase
          .from("admin_whitelist")
          .select("email")
          .ilike("email", nextSession.user.email)
          .maybeSingle();
         setIsAuthorized(!!data);
      } else {
         setIsAuthorized(false);
      }
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
          Verifying Access...
        </div>
      </div>
    );
  }

  // 1. Not logged in -> Login Page
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Logged in but not in database -> Unauthorized Page
  if (!isAuthorized) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // 3. Success
  return <>{children}</>;
}