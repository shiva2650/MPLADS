import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  WifiOff
} from 'lucide-react';

interface LoginPageProps {
  onEnterPublic: () => void;
  onBackToHome?: () => void;
  onLoginSuccess?: () => void;
  initialRole?: 'MP' | 'ADMIN' | 'AGENCY';
}

interface AuthError {
  type: 'invalid_credentials' | 'server_unreachable' | 'unknown';
  title: string;
  message: string;
  suggestion?: string;
}

const parseAuthError = (err: any): AuthError => {
  const rawMsg = (err?.message || String(err || '')).trim();
  const lower = rawMsg.toLowerCase();

  if (
    lower.includes('invalid credentials') ||
    lower.includes('invalid user id') ||
    lower.includes('password') ||
    lower.includes('401') ||
    lower.includes('unauthorized')
  ) {
    return {
      type: 'invalid_credentials',
      title: 'Invalid credentials',
      message: 'The User ID or password you entered does not match authorized records.',
      suggestion: 'Please verify your departmental User ID and password.'
    };
  }

  if (
    lower.includes('server unreachable') ||
    lower.includes('failed to fetch') ||
    lower.includes('network') ||
    lower.includes('econnrefused') ||
    lower.includes('load failed') ||
    lower.includes('502') ||
    lower.includes('503') ||
    lower.includes('504')
  ) {
    return {
      type: 'server_unreachable',
      title: 'Server unreachable',
      message: 'Unable to establish a secure connection with the central authentication service.',
      suggestion: 'Please check your network connection or verify that the server is online.'
    };
  }

  return {
    type: 'unknown',
    title: 'Authentication Failed',
    message: rawMsg || 'An unexpected error occurred during the authentication attempt.',
    suggestion: 'Please verify your credentials and try again.'
  };
};

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterPublic, onBackToHome, onLoginSuccess }) => {
  const { login } = useAuth();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(userId, password);
      onLoginSuccess?.();
    } catch (err: any) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-panel-bg flex flex-col justify-between font-sans">
      {/* Top National Strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Header bar */}
      <header className="bg-white border-b border-slate-border py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-lg bg-panel-bg hover:bg-slate-border text-slate-body text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer mr-1"
                title="Return to Scheme Home & Public Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-govt-navy text-white flex items-center justify-center font-serif text-sm font-bold border-2 border-govt-saffron/50">
              GOI
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-muted font-semibold">
                भारत सरकार | Government of India
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-body">
                Ministry of Statistics and Programme Implementation (MoSPI)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="text-xs font-semibold text-slate-muted hover:text-slate-body sm:hidden cursor-pointer"
              >
                Home
              </button>
            )}
            <button
              onClick={onEnterPublic}
              className="text-xs font-bold text-govt-navy hover:text-govt-navy-light underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Skip to Citizen Public Transparency Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-border overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-govt-navy text-white text-center">
            {onBackToHome && (
              <div className="flex justify-start mb-3">
                <button
                  onClick={onBackToHome}
                  className="text-[11px] font-medium text-panel-bg/80 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Return to Scheme Home</span>
                </button>
              </div>
            )}
            <div className="inline-flex p-2.5 rounded-xl bg-white/10 text-white mb-2 border border-white/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">MPLADS AI Integrity & Monitoring</h1>
            <p className="text-xs text-panel-bg/80 mt-1">
              Secure Role-Based Access Control & Anomaly Detection Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div
                role="alert"
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  error.type === 'invalid_credentials'
                    ? 'bg-[#FAF3E0] border-[#E8DAB2] text-[#935D26]'
                    : error.type === 'server_unreachable'
                    ? 'bg-[#FBEBE8] border-[#F5C2B4] text-[#B85338]'
                    : 'bg-[#FAF3E0] border-[#E8DAB2] text-[#935D26]'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {error.type === 'server_unreachable' ? (
                    <WifiOff className="w-4 h-4 text-[#B85338]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#935D26]" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-[13px] leading-snug tracking-tight">
                    {error.title}
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-95">
                    {error.message}
                  </p>
                  {error.suggestion && (
                    <p className="text-[10px] font-semibold opacity-90 pt-0.5">
                      💡 {error.suggestion}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-body mb-1">
                Official User ID / Employee Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={e => {
                    setUserId(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. MP001, ADMIN001, AGENCY001"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-border rounded-lg text-slate-body uppercase font-mono font-bold bg-white focus:ring-2 focus:ring-govt-navy focus:border-govt-navy focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-body">Security Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-govt-navy hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter authorized password"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-border rounded-lg text-slate-body bg-white focus:ring-2 focus:ring-govt-navy focus:border-govt-navy focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-body cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-govt-navy text-white font-bold rounded-lg hover:bg-govt-navy-light disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Secure Portal'}
            </button>

            {/* Department Officer Credential Notice */}
            <div className="pt-4 border-t border-slate-border text-slate-muted">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-body mb-1">
                Authorized Department Portals
              </div>
              <p className="text-[11px] text-slate-muted leading-relaxed">
                Registered officers from District Collectorates, Parliamentary Secretariats, and Implementing Authorities may log in using their assigned Government of India service IDs.
              </p>
            </div>

            {/* Citizen Open Access */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onEnterPublic}
                className="w-full py-2 bg-panel-bg hover:bg-slate-border text-slate-body font-bold rounded-lg border border-slate-border transition-colors cursor-pointer"
              >
                Access as Public Citizen (Transparency View)
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-slate-border space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-body">Official Password Reset Protocol</h3>
            <p className="text-slate-muted leading-relaxed">
              Under National Informatics Centre (NIC) security directives, MPLADS officer credentials can only be reset through your registered District Magistrate Administrative Office or Nodal Parliamentary Officer.
            </p>
            <div className="p-2.5 bg-slate-50 text-slate-body rounded-xl font-mono text-[11px] border border-slate-border">
              Contact your Nodal System Administrator or NIC State Centre Helpdesk for credential recovery.
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-govt-navy text-white rounded-lg font-bold hover:bg-govt-navy-light transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-border py-3 text-center text-xs text-slate-muted">
        <div>National Informatics Centre (NIC) &copy; {new Date().getFullYear()} Ministry of Statistics & Programme Implementation</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Government of India • e-SAKSHI MPLADS Verification Engine</div>
      </footer>
    </div>
  );
};
