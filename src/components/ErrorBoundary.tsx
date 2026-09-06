import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Globe } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handlePublicMode = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('mplads_public_mode', 'true');
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9F7] text-[#1B3022] flex items-center justify-center p-4 font-sans antialiased">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-[#DDE5D4] shadow-sm p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 pb-5 border-b border-[#E7EFE0]">
              <div className="w-12 h-12 rounded-xl bg-[#F5C2B4]/30 border border-[#E07A5F]/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#B85338]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-[#588157] tracking-wider uppercase">
                  MPLADS AI Integrity System • Diagnostic Mode
                </div>
                <h2 className="text-xl font-bold text-[#1B3022]">
                  Application Initialization Notice
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="py-5 space-y-3 text-sm text-[#455A47] leading-relaxed">
              <p>
                The application encountered an unexpected runtime condition during initialization.
                This may occur due to cached browser state or network interruptions while loading assets.
              </p>

              {this.state.error && (
                <div className="p-3 bg-[#FDF2ED] rounded-xl border border-[#F5C2B4] text-xs font-mono text-[#A62B17] break-words">
                  <strong>Error:</strong> {this.state.error.message || String(this.state.error)}
                </div>
              )}
            </div>

            {/* Resolution Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#395C40] hover:bg-[#2C4A32] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Portal
              </button>

              <button
                onClick={this.handleResetCache}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FAFBF9] hover:bg-[#EFEFEA] border border-[#DDE5D4] text-[#1B3022] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-[#B85338]" />
                Clear Cache & Restart
              </button>

              <button
                onClick={this.handlePublicMode}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E8F0E6] hover:bg-[#DCE7D9] text-[#2C4A32] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                Public Mode
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E7EFE0] text-center text-[11px] text-[#6B7E6F]">
              Ministry of Statistics & Programme Implementation (MoSPI) • Government of India
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
