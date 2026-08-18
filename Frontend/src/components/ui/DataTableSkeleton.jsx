import React from "react";

// Skeleton loader that mirrors the admin list tables so the first load feels
// instant instead of a blank/full-screen spinner.
export default function DataTableSkeleton({ rows = 6, isRTL = false }) {
  return (
    <div className="glass rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              {[0, 1, 2, 3].map((i) => (
                <th key={i} className="px-10 py-8">
                  <div className="h-3 w-20 rounded-full bg-white/5 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {Array.from({ length: rows }).map((_, r) => (
              <tr key={r}>
                {[0, 1, 2, 3].map((c) => (
                  <td key={c} className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse shrink-0" />
                      <div className="space-y-2 w-full max-w-[160px]">
                        <div className="h-3 w-24 rounded-full bg-white/5 animate-pulse" />
                        <div className="h-2.5 w-16 rounded-full bg-white/[0.04] animate-pulse" />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}