import React, { useState, FormEvent } from "react";
import { ShieldCheck, Key, UserCheck, AlertCircle, HelpCircle } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { encryptedStorage } from "../crypto";

interface AuthGateProps {
  onAuthenticated: (user: { uid: string; email: string | null; isLocalOnly: boolean }) => void;
}

export default function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  // Fallback passcode for basic authentication
  const DEFAULT_LOCAL_PASSCODE = "TRUSTLENS-2026";

  const handleLocalSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (passcode.trim() === DEFAULT_LOCAL_PASSCODE) {
        // Persist local authentication using our encrypted storage driver
        const localSession = {
          uid: "local_operator_2026",
          email: "local.safeguard@trustlens.internal",
          isLocalOnly: true,
          authenticatedAt: new Date().toISOString(),
        };
        
        encryptedStorage.setItem("trustlens_session", localSession);
        onAuthenticated({
          uid: localSession.uid,
          email: localSession.email,
          isLocalOnly: true,
        });
      } else {
        setError("AUTHENTICATION FAILED: Invalid security passcode sequence.");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        onAuthenticated({
          uid: result.user.uid,
          email: result.user.email,
          isLocalOnly: false,
        });
      }
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(`AUTHENTICATION ERROR: ${err?.message || "Cloud authentication failed."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4 animate-fade-in" id="auth-gate-panel">
      <div className="w-full max-w-md rounded-xl border border-emerald-500/20 bg-[#0d0d0f] p-8 shadow-[0_0_50px_rgba(16,185,129,0.05)] space-y-6">
        {/* Badge & Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-950/10 text-emerald-400">
            <ShieldCheck className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-white">
              Trust<span className="text-emerald-400">Lens</span>
            </h2>
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-500/60">
              Forensic Authorization Node
            </p>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Authorized Cybersecurity audit engine. Select your entry clearance level to unlock the inspection console.
          </p>
        </div>

        {/* Error Boundary Display */}
        {error && (
          <div className="rounded border border-red-500/20 bg-red-950/20 p-3 flex gap-2 items-start text-xs text-red-400 font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Clearance Selectors */}
        <div className="space-y-4">
          {/* Cloud Login option */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded bg-emerald-600 px-4 py-3 font-sans text-sm font-semibold text-white hover:bg-emerald-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            id="google-signin-btn"
          >
            <UserCheck className="h-4 w-4" />
            Authenticate with Google (Cloud Sync)
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-900"></div>
            <span className="flex-shrink mx-4 font-mono text-[9px] text-slate-600 uppercase tracking-widest">Or Local Console Entry</span>
            <div className="flex-grow border-t border-slate-900"></div>
          </div>

          {/* Local Operator Form */}
          <form onSubmit={handleLocalSubmit} className="space-y-3" id="local-auth-form">
            <div className="space-y-1">
              <label className="block font-mono text-[10px] text-slate-500 uppercase">Operator Passcode Clearance</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Clearance Key Code"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded border border-slate-800 bg-[#0a0a0b] pl-10 pr-4 py-2.5 font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-all focus:outline-none"
              id="submit-local-gate"
            >
              {isLoading ? "AUTHORIZING..." : "ENTER AUDIT CONSOLE"}
            </button>
          </form>

          {/* Code assistance trigger */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowHelper(!showHelper)}
              className="inline-flex items-center gap-1 font-mono text-[9px] uppercase text-emerald-500/50 hover:text-emerald-400 transition-colors"
              type="button"
            >
              <HelpCircle className="h-3 w-3" />
              {showHelper ? "Hide Clearance Guide" : "Need clearance keys?"}
            </button>
            
            {showHelper && (
              <div className="mt-2 text-left rounded border border-emerald-500/15 bg-emerald-950/10 p-3 font-mono text-[10px] text-emerald-400 leading-relaxed">
                <span className="font-bold text-emerald-450 block mb-1">AUDIT MANUAL:</span>
                • Local operator passcode is: <span className="text-white font-bold bg-[#0a0a0b] px-1 py-0.5 rounded border border-emerald-500/30">TRUSTLENS-2026</span>
                <br />
                • Cloud authentication uses Firebase Auth to save scans to persistent history databases.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
