import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AuthGate from "./components/AuthGate";
import ForensicDashboard from "./components/ForensicDashboard";
import HistoricalScans from "./components/HistoricalScans";
import StandardsDocumentation from "./components/StandardsDocumentation";
import { encryptedStorage } from "./crypto";
import { ForensicScan } from "./types";
import { ShieldCheck, Cpu } from "lucide-react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Operator {
  uid: string;
  email: string | null;
  isLocalOnly: boolean;
}

export default function App() {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high">("medium");
  const [selectedScan, setSelectedScan] = useState<ForensicScan | null>(null);
  const [historyTrigger, setHistoryTrigger] = useState(0);

  // Load persistence configurations and operational preference thresholds
  useEffect(() => {
    setIsLoadingSession(true);
    
    // First, verify local crypt session existence
    const localSession = encryptedStorage.getItem("trustlens_session");
    if (localSession) {
      setOperator({
        uid: localSession.uid,
        email: localSession.email,
        isLocalOnly: true,
      });
      setIsLoadingSession(false);
    } else {
      // Synchronize with Firebase authentication state listener
      const unsubscribe = onAuthStateChanged(auth, (user: any) => {
        if (user) {
          setOperator({
            uid: user.uid,
            email: user.email,
            isLocalOnly: false,
          });
        } else {
          setOperator(null);
        }
        setIsLoadingSession(false);
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync sensitivity preferences
  useEffect(() => {
    if (operator) {
      const storedSensitivity = localStorage.getItem(`trustlens_sensitivity_${operator.uid}`);
      if (storedSensitivity === "low" || storedSensitivity === "medium" || storedSensitivity === "high") {
        setSensitivity(storedSensitivity);
      }
    }
  }, [operator]);

  const handleSensitivityChange = (newVal: "low" | "medium" | "high") => {
    setSensitivity(newVal);
    if (operator) {
      localStorage.setItem(`trustlens_sensitivity_${operator.uid}`, newVal);
    }
  };

  const handleAuthenticated = (newOperator: Operator) => {
    setOperator(newOperator);
  };

  const handleLogout = async () => {
    if (operator?.isLocalOnly) {
      encryptedStorage.removeItem("trustlens_session");
      setOperator(null);
    } else {
      await auth.signOut();
      setOperator(null);
    }
    // Deep cache wipes
    setSelectedScan(null);
    setActiveTab("dashboard");
  };

  const handleSelectScan = (scan: ForensicScan) => {
    setSelectedScan(scan);
    setActiveTab("dashboard"); // Pull report straight back to main dashboard viewport
  };

  const notifyScanSaved = () => {
    setHistoryTrigger((prev) => prev + 1);
  };

  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] text-slate-100">
        <div className="space-y-4 text-center">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
            <div className="absolute h-full w-full rounded-full border-4 border-slate-900 border-t-emerald-500 animate-spin" />
            <Cpu className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-500/60">
            Initializing Authenticity Core...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-white" id="trustlens-app-root">
      <div>
        {/* Navigation panel */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          operatorEmail={operator ? operator.email : null}
          sensitivity={sensitivity}
          setSensitivity={handleSensitivityChange}
          onLogout={handleLogout}
        />

        <main className="mx-auto max-w-7xl px-6 py-8">
          {!operator ? (
            <AuthGate onAuthenticated={handleAuthenticated} />
          ) : (
            <div className="space-y-6">
              {activeTab === "dashboard" && (
                <ForensicDashboard
                  userId={operator.uid}
                  isLocalOnly={operator.isLocalOnly}
                  sensitivity={sensitivity}
                  onScanSaved={notifyScanSaved}
                  selectedScan={selectedScan}
                  setSelectedScan={setSelectedScan}
                />
              )}

              {activeTab === "history" && (
                <HistoricalScans
                  userId={operator.uid}
                  isLocalOnly={operator.isLocalOnly}
                  onSelectScan={handleSelectScan}
                  key={historyTrigger}
                />
              )}

              {activeTab === "standards" && <StandardsDocumentation />}
            </div>
          )}
        </main>
      </div>

      {/* Institutional footer */}
      <footer className="border-t border-slate-800 bg-[#0d0d0f] py-6 px-6">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-mono text-[9px] text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500/40" />
            <span>TrustLens Guardrail Suite v2.6.1</span>
          </div>
          <span>Confidential Operator Terminal — Standard Safeguard Certified</span>
        </div>
      </footer>
    </div>
  );
}
