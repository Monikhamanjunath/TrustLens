import { ShieldAlert, LogOut, Settings, Radio } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  operatorEmail: string | null;
  sensitivity: "low" | "medium" | "high";
  setSensitivity: (value: "low" | "medium" | "high") => void;
  onLogout: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  operatorEmail,
  sensitivity,
  setSensitivity,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="border-b border-emerald-500/20 bg-[#0d0d0f] px-6 py-4" id="trustlens-navbar">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-black">
            <div className="w-4 h-4 border-2 border-black rotate-45" />
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-white">
              Trust<span className="text-emerald-400">Lens</span>
              <span className="ml-2 inline-block font-mono text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                FORENSIC v2.4
              </span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "dashboard", label: "Forensic Dashboard" },
            { id: "history", label: "Historical Scans" },
            { id: "standards", label: "Safety Standards" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded px-3.5 py-1.5 font-sans text-xs sm:text-sm font-medium tracking-wide transition-all whitespace-nowrap border shrink-0 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "text-slate-400 border-transparent hover:bg-[#16161a] hover:text-white"
                }`}
                id={`nav-${tab.id}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Operator Status & Controls */}
        <div className="flex flex-wrap items-center gap-4 border-t border-slate-800 pt-4 md:border-0 md:pt-0">
          {/* Sensitivity Setting */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-500" />
            <span className="font-mono text-[10px] uppercase text-slate-500">Scan Sensitivity:</span>
            <select
              value={sensitivity}
              onChange={(e) => setSensitivity(e.target.value as "low" | "medium" | "high")}
              className="rounded border border-slate-850 bg-slate-900 px-3 py-1 font-mono text-xs text-emerald-400 focus:border-emerald-500 focus:outline-none"
              id="sensitivity-selector"
            >
              <option value="low">Low Mode</option>
              <option value="medium">Medium Standards</option>
              <option value="high">Strict High Auditing</option>
            </select>
          </div>

          {/* User badge */}
          {operatorEmail && (
            <div className="flex items-center gap-4 pl-2 border-l border-slate-800">
              <div className="text-right">
                <span className="flex items-center gap-1.5 justify-end font-mono text-[10px] text-emerald-400">
                  <Radio className="h-3 w-3 animate-ping" />
                  ACTIVE OPERATOR
                </span>
                <p className="font-mono text-xs text-slate-300 max-w-[150px] truncate">{operatorEmail}</p>
              </div>

              <button
                onClick={onLogout}
                className="rounded border border-red-500/30 bg-red-950/20 p-2 text-red-400 transition-all hover:bg-red-950/50 hover:text-red-300"
                title="Disconnect Console Session"
                id="btn-logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
