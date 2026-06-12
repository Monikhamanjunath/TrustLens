import { ShieldCheck, AlertOctagon, HeartHandshake, Skull, Terminal } from "lucide-react";

export default function StandardsDocumentation() {
  const categories = [
    {
      title: "HARM_CATEGORY_HATE_SPEECH",
      level: "BLOCK_LOW_AND_ABOVE",
      description: "Blocks contents promoting violence, discrimination, or degrading speech targeting race, religion, gender, or age vectors.",
      icon: Skull,
      color: "text-red-400 border-red-500/20 bg-red-950/10",
    },
    {
      title: "HARM_CATEGORY_HARASSMENT",
      level: "BLOCK_LOW_AND_ABOVE",
      description: "Blocks contents designed to bully, threaten, stalk, or inflict emotional distress on individual operators.",
      icon: AlertOctagon,
      color: "text-amber-400 border-amber-500/20 bg-amber-950/10",
    },
    {
      title: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      level: "BLOCK_LOW_AND_ABOVE",
      description: "Blocks malicious sexual payloads or generating inappropriate biological deepfakes.",
      icon: ShieldCheck,
      color: "text-pink-400 border-pink-500/20 bg-pink-950/10",
    },
    {
      title: "HARM_CATEGORY_DANGEROUS_CONTENT",
      level: "BLOCK_LOW_AND_ABOVE",
      description: "Blocks payloads detailing weapons fabrication, self-harm, sabotage techniques, or malicious instruction vectors.",
      icon: Skull,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
    },
    {
      title: "HARM_CATEGORY_CIVIC_INTEGRITY",
      level: "BLOCK_LOW_AND_ABOVE",
      description: "Filters coordinated disinformation campaigns, electoral spoofing, or state-level synthetic forgery attempts.",
      icon: HeartHandshake,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="standards-panel">
      {/* Page Header */}
      <div>
        <h2 className="font-sans text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          Safety Standards & Compliance Documentation
        </h2>
        <p className="font-mono text-xs text-slate-400 mt-1 uppercase tracking-wider">
          TrustLens Lab Institutional Guardrail Directives
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Safe Guards System Configs */}
        <div className="rounded-xl border border-slate-800 bg-[#0d0d0f] p-6 space-y-4">
          <h3 className="font-sans text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Terminal className="h-5 w-5" /> Enforced Gemini Safety Thresholds
          </h3>
          <p className="font-sans text-sm text-slate-400">
            TrustLens explicitly overrides baseline model boundaries to mandate a strict Zero-Tolerance filter.
            All input buffers are intercepted by the following hardware hooks prior to rendering any evaluations:
          </p>

          <div className="space-y-3">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className={`rounded-lg border p-4 space-y-1 ${cat.color}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{cat.title}</span>
                    <span className="font-mono text-[9px] bg-slate-950/60 px-1.5 py-0.5 rounded border border-current">
                      {cat.level}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-300 leading-relaxed">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Signatures & Indicators */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-[#0d0d0f] p-6 space-y-4">
            <h3 className="font-sans text-lg font-semibold text-emerald-400">
              Synthetic Media Diagnostic Signatures
            </h3>
            <p className="font-sans text-sm text-slate-400 leading-relaxed">
              When analyzing media, the Gemini core uses specialized deep features to check for authenticity indicators:
            </p>

            <div className="space-y-4 font-sans text-sm">
              <div className="border-l-2 border-emerald-500/50 pl-3">
                <span className="text-slate-100 font-medium">Visual Forensic Indicators (Images)</span>
                <p className="text-slate-400 text-xs mt-1">
                  Mismatched ocular reflections, geometric inconsistencies in backgrounds, blurred ear lobes, double iris textures, and blending boundaries along shadows/hairline profiles.
                </p>
              </div>

              <div className="border-l-2 border-emerald-500/50 pl-3">
                <span className="text-slate-100 font-medium">Acoustic Forensic Indicators (Audio)</span>
                <p className="text-slate-400 text-xs mt-1">
                  Absence of transient micro-vocalizations, phase incoherence, spectral frequency discontinuities, unnaturally static atmospheric noise, and syllable timing alignments matching synthetic codecs.
                </p>
              </div>

              <div className="border-l-2 border-red-500/50 pl-3">
                <span className="text-slate-100 font-medium">Semantic Forensic Indicators (Text)</span>
                <p className="text-slate-400 text-xs mt-1">
                  Indirect prompt leakage attempts (e.g., &quot;ignore previous instructions&quot;), stylized sentence completions matching adversarial templates, repetitive loops, and factual confabulations.
                </p>
              </div>
            </div>
          </div>

          {/* Operational SOP */}
          <div className="rounded-xl border border-slate-800 bg-[#0d0d0f] p-6 space-y-3">
            <h3 className="font-sans text-lg font-semibold text-slate-200">
              Auditor Standard Operating Procedure (SOP)
            </h3>
            <ol className="list-decimal list-inside font-sans text-xs text-slate-400 space-y-2 leading-relaxed">
              <li>Deploy all scans with matching operator authorization context.</li>
              <li>Toggle sensitivity levels from Low to Strict High based on threat vector assessment requests.</li>
              <li>Cross-reference bounding box markers on images directly within corresponding visual grids.</li>
              <li>Inspect marked timestamp voice artifacts using the live wav player before flagging standard logs.</li>
              <li>Export and archive records securely using local cryptographic sessions or unified Cloud backups.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
