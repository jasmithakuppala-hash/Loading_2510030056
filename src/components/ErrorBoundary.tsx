import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Film, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Cineverse Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cineDark-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-cineRed/15 border border-cineRed/30 text-cineRed flex items-center justify-center mx-auto shadow-xl shadow-cineRed/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
                SOMETHING INTERRUPTED THE SCREENING.
              </h2>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                An unexpected system glitch occurred while rendering the page. Don't worry, your saved watchlist data remains safe.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cineRed via-red-600 to-cineRed text-white font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cineRed/30 hover:shadow-cineRed/50 hover:scale-105 transition-all focus:outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
