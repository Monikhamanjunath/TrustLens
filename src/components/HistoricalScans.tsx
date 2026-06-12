import React, { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { encryptedStorage } from "../crypto";
import { ForensicScan, PrimaryClassification } from "../types";
import { FileText, Image, Volume2, Calendar, ShieldCheck, ShieldAlert, ChevronRight, HardDrive, Trash2 } from "lucide-react";

interface HistoricalScansProps {
  userId: string;
  isLocalOnly: boolean;
  onSelectScan: (scan: ForensicScan) => void;
  key?: number;
}

export default function HistoricalScans({ userId, isLocalOnly, onSelectScan }: HistoricalScansProps) {
  const [scans, setScans] = useState<ForensicScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScans();
  }, [userId, isLocalOnly]);

  const loadScans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isLocalOnly) {
        // Load from encrypted LocalStorage
        const localScans = encryptedStorage.getItem("trustlens_local_scans") || [];
        // Filter by user ID
        const userScans = localScans.filter((s: ForensicScan) => s.userId === userId);
        // Sort descending
        userScans.sort((a: ForensicScan, b: ForensicScan) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setScans(userScans);
      } else {
        // Query from Cloud Firestore
        const scansRef = collection(db, "scans");
        const q = query(
          scansRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        try {
          const querySnapshot = await getDocs(q);
          const cloudScans: ForensicScan[] = [];
          querySnapshot.forEach((doc) => {
            cloudScans.push({ id: doc.id, ...doc.data() } as ForensicScan);
          });
          setScans(cloudScans);
        } catch (dbErr: any) {
          handleFirestoreError(dbErr, OperationType.LIST, "scans");
        }
      }
    } catch (err: any) {
      console.error("Failed to load historical scans:", err);
      setError("FAILED TO RETRIEVE HISTORIC LOGS: " + (err?.message || "Verify your connection or auth token."));
    } finally {
      setIsLoading(false);
    }
  };

  const clearScans = () => {
    if (!window.confirm("Are you sure you want to completely clear your forensic scanner reports history?")) return;
    
    if (isLocalOnly) {
      encryptedStorage.setItem("trustlens_local_scans", []);
      setScans([]);
    } else {
      alert("Note: Deletion must be managed by the secure Cloud Firestore console to preserve strict compliance audit trails.");
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const padBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getBadgeColors = (classification: PrimaryClassification) => {
    switch (classification) {
      case "Authentic":
        return "border-emerald-500/30 bg-emerald-950/20 text-emerald-400";
      case "Suspected AI-Generated":
        return "border-amber-500/30 bg-amber-955/20 text-amber-400";
      case "Jailbreak Attempt":
        return "border-red-500/30 bg-red-955/20 text-red-400";
      default:
        return "border-slate-800 bg-slate-900 text-slate-400";
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-4 w-4 text-emerald-400" />;
    if (fileType.startsWith("audio/")) return <Volume2 className="h-4 w-4 text-pink-400" />;
    return <FileText className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="historical-scans-panel">
      {/* Header element */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-2xl font-bold text-slate-100 flex items-center gap-2">
            <HardDrive className="h-6 w-6 text-emerald-400" />
            Historical Scan Registers
          </h2>
          <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
            Operator Cryptographic Report Index — {isLocalOnly ? "ENCRYPTED LOCAL STORAGE" : "FIRESTORE CLOUD ENGINE"}
          </p>
        </div>

        {scans.length > 0 && (
          <button
            onClick={clearScans}
            className="rounded border border-red-500/20 bg-red-950/10 px-3 py-1.5 font-mono text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            id="clear-history-btn"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Wipe Local Log
          </button>
        )}
      </div>

      {/* Error boundaries */}
      {error && (
        <div className="rounded border border-red-500/20 bg-red-950/20 p-4 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Primary load indicators */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-800 bg-[#0d0d0f] p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="font-mono text-xs text-slate-400 mt-4 uppercase tracking-widest">
            Accessing Report Repositories...
          </p>
        </div>
      ) : scans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-[#0d0d0f]/50 p-12 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-500">
            <HardDrive className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sans text-sm font-semibold text-slate-300">No historical scans loaded</h4>
            <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t conducted any content authenticity scans yet under this account. Upload and investigate digital assets inside the Forensic Dashboard to log indicators.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-[#0d0d0f] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-left border-collapse" id="history-scans-table">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  <th className="p-4">Content Ref</th>
                  <th className="p-4">Classification</th>
                  <th className="p-4">Probability</th>
                  <th className="p-4">Parameters</th>
                  <th className="p-4">Audit Timestamp</th>
                  <th className="p-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-900/35 transition-colors group cursor-pointer"
                    onClick={() => onSelectScan(scan)}
                    id={`scan-row-${scan.id}`}
                  >
                    {/* Content type/Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 border border-slate-800">
                          {getFileIcon(scan.fileType)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors max-w-[180px] truncate">
                            {scan.fileName}
                          </p>
                          <p className="font-mono text-[9px] text-slate-500 uppercase truncate">
                            {scan.fileType}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase ${getBadgeColors(scan.primary_classification)}`}>
                        {scan.primary_classification}
                      </span>
                    </td>

                    {/* Prob score */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              scan.is_synthetic_probability > 0.7
                                ? "bg-red-500"
                                : scan.is_synthetic_probability > 0.3
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${scan.is_synthetic_probability * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs text-slate-300 font-bold">
                          {(scan.is_synthetic_probability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    {/* Bytes */}
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {padBytes(scan.fileSize)}
                    </td>

                    {/* Date */}
                    <td className="p-4 font-mono text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                      <Calendar className="h-3 w-3 text-slate-600" />
                      {formatDate(scan.createdAt)}
                    </td>

                    {/* Load Report button */}
                    <td className="p-4 text-right">
                      <button
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-500 uppercase group-hover:translate-x-0.5 transition-transform"
                        id={`btn-load-${scan.id}`}
                      >
                        Launch Report
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
