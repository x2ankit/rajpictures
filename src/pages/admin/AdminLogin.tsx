import { Aperture } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_AUTH_KEY = "isAdminAuthenticated";
const DEFAULT_PIN = "2025";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const expectedPin = useMemo(() => {
    const v = (import.meta.env.VITE_ADMIN_PIN as string | undefined) || DEFAULT_PIN;
    return String(v);
  }, []);

  useEffect(() => {
    try {
      const isAuthed = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
      if (isAuthed) navigate("/admin/dashboard", { replace: true });
    } catch {
      // ignore
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (pin === expectedPin) {
      try {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
      } catch {
        // ignore
      }
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    setError("Invalid Admin PIN. Please try again.");
    setPin("");
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
              Enter PIN to continue
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              This is a temporary PIN-based access system.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <input
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="Enter Admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors text-center tracking-[0.5em]"
              />

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors uppercase tracking-widest text-sm"
              >
                Authorize
              </button>
            </form>

            <div className="mt-6 text-xs text-zinc-500">
              You will be redirected to the dashboard after authorization.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
