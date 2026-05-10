
// ============================================
// LoadingSpinner.jsx - Reusable Loading UI
// ============================================
// Renders a pulsing Brain icon as a spinner.
// Pass fullScreen={true} for a full-viewport
// overlay (used during route guard checks).
// No TODOs — fully provided.
// ============================================

import { Brain } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 px-4 backdrop-blur-sm">
        <div className="rounded-2xl border border-gray-700/70 bg-gray-800/80 px-6 py-7 text-center shadow-2xl shadow-indigo-900/30 transition-all duration-300 sm:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-purple-500/25 ring-1 ring-indigo-400/40 transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16">
            <Brain className="h-8 w-8 text-indigo-300 sm:h-9 sm:w-9" />
          </div>
          <p className="text-sm font-medium tracking-wide text-indigo-100/90">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-indigo-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30 sm:h-11 sm:w-11">
        <Brain className="h-6 w-6 text-indigo-300" />
      </div>
    </div>
  );
}
