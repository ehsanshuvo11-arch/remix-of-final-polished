import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
  isSection?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[POLISHED ErrorBoundary${this.props.sectionName ? ` — ${this.props.sectionName}` : ''}]`, error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.isSection) {
        // Section-level fallback: doesn't break the rest of the page
        return (
          <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-primary/5 rounded-2xl border border-primary/10 my-8">
            <p className="text-sm font-medium text-primary/70 mb-3">
              This section is temporarily unavailable.
            </p>
            <button
              onClick={this.handleReset}
              className="text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-primary/20 hover:border-accent hover:text-accent transition-all duration-300"
            >
              Retry Section
            </button>
          </div>
        );
      }

      // Full-page fallback
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0b0f19] text-[#f9fafb] px-6 py-12 select-none relative overflow-hidden">
          {/* Subtle warm glow background */}
          <div
            className="absolute pointer-events-none rounded-full blur-[120px] opacity-20"
            style={{
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, #fb923c 0%, #1e3a8a 70%, transparent 100%)',
            }}
          />

          <div className="relative z-10 max-w-[540px] text-center flex flex-col items-center">
            {/* Wordmark */}
            <h1
              className="text-2xl md:text-3xl font-light tracking-[0.25em] uppercase mb-6 text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              POLISHED
            </h1>

            <div className="w-12 h-px bg-[#fb923c]/40 mb-6" />

            <h2 className="text-lg md:text-xl font-normal text-white/90 mb-3">
              Experiencing a brief visual pause.
            </h2>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-8 max-w-[420px]">
              We encountered a minor display issue. Click below to refresh the page and restore the full experience.
            </p>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-medium tracking-[0.18em] uppercase bg-[#1e3a8a] text-white hover:bg-[#fb923c] hover:text-[#0b0f19] transition-all duration-300 shadow-lg active:scale-95"
            >
              Refresh Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
