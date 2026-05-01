"use client";

/**
 * ReportPanel — Panel laporan AI yang dihasilkan oleh LLM
 * Menampilkan teks laporan dalam Bahasa Indonesia beserta disclaimer
 */

interface ReportPanelProps {
  report: string;
}

export default function ReportPanel({ report }: ReportPanelProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-700 text-white">AI Generated Report</h3>
            <p className="text-xs text-slate-400">Dihasilkan oleh Large Language Model</p>
          </div>
          <span className="ml-auto px-2.5 py-1 rounded-full text-xs font-600 bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Bahasa Indonesia
          </span>
        </div>
      </div>

      {/* Report content */}
      <div className="px-5 py-5">
        <div className="prose prose-sm max-w-none">
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-400">
            {report}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 py-4 bg-amber-500/10 border-t border-amber-500/30">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400 shrink-0 mt-0.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <circle cx="12" cy="17" r="1" />
          </svg>
          <p className="text-xs text-amber-200/90 italic leading-relaxed">
            <strong>Peringatan:</strong> Laporan ini dihasilkan secara otomatis oleh AI dan{" "}
            <strong>bukan merupakan diagnosis medis</strong>. Hasil ini hanya untuk tujuan
            penelitian. Selalu konsultasikan dengan dokter atau tenaga medis profesional untuk
            interpretasi dan tindakan medis yang tepat.
          </p>
        </div>
      </div>
    </div>
  );
}
