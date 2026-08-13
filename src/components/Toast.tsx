import React from 'react';
import { Bookmark, CheckCircle2, Trash2, X } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useWatchlist();

  if (!toast) return null;

  const isAdd = toast.type === 'add';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transition-all ${
          isAdd
            ? 'bg-cineDark-800/90 text-white shadow-cineRed/20'
            : 'bg-cineDark-800/90 text-gray-200 shadow-cineViolet/20'
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isAdd ? 'bg-cineRed text-white' : 'bg-cineViolet text-white'
          }`}
        >
          {isAdd ? <Bookmark className="w-4 h-4 fill-white" /> : <Trash2 className="w-4 h-4" />}
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-gray-400">
            {isAdd ? 'Watchlist Updated' : 'Removed'}
          </span>
          <span className="font-sans text-sm font-semibold text-white max-w-xs truncate">
            {toast.message}
          </span>
        </div>
        <button
          onClick={clearToast}
          className="ml-2 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
