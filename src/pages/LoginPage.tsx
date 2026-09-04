import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  Building2,
  Landmark,
  UserCheck,
  ArrowRight,
  Info,
  AlertTriangle,
  WifiOff
} from 'lucide-react';

interface LoginPageProps {
  onEnterPublic: () => void;
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
      message: 'The User ID or password you entered does not match our authorized records.',
      suggestion: 'Please verify your credentials or use the 1-Click Demo Login options below.'
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
    suggestion: 'Please try again or select a demonstration profile below.'
  };
};

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterPublic }) => {
  const { login } = useAuth();

  const [userId, setUserId] = useState('ADMIN001');
  const [password, setPassword] = useState('Admin@123');
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
    } catch (err: any) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    setError(null);
    setLoading(true);

    try {
      await login(id, pass);
    } catch (err: any) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col justify-between font-sans">
      {/* Top National Strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Header bar */}
      <header className="bg-white border-b border-[#DDE5D4] py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1B3022] text-[#A3B18A] flex items-center justify-center font-serif text-sm font-bold border-2 border-[#395C40]">
              GOI
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#588157] font-semibold">
                भारत सरकार | Government of India
              </div>
              <div className="text-sm sm:text-base font-bold text-[#1B3022]">
                Ministry of Statistics and Programme Implementation (MoSPI)
              </div>
            </div>
          </div>

          <button
            onClick={onEnterPublic}
            className="text-xs font-bold text-[#395C40] hover:text-[#1B3022] underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Skip to Citizen Public Transparency Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#DDE5D4] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-[#1B3022] text-white text-center">
            <div className="inline-flex p-2.5 rounded-xl bg-[#395C40]/50 text-[#DDE5D4] mb-2 border border-[#395C40]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">MPLADS AI Integrity & Monitoring</h1>
            <p className="text-xs text-[#A3B18A] mt-1">
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
              <label className="block font-bold text-[#1B3022] mb-1">
                Official User ID / Employee Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3B18A]">
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
                  className="w-full pl-9 pr-3 py-2.5 border border-[#DDE5D4] rounded-lg text-[#1B3022] uppercase font-mono font-bold bg-white focus:ring-2 focus:ring-[#395C40] focus:border-[#395C40] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#1B3022]">Security Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#395C40] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#A3B18A]">
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
                  className="w-full pl-9 pr-10 py-2.5 border border-[#DDE5D4] rounded-lg text-[#1B3022] bg-white focus:ring-2 focus:ring-[#395C40] focus:border-[#395C40] focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A3B18A] hover:text-[#1B3022] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#395C40] text-white font-bold rounded-lg hover:bg-[#2C4A34] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Secure Portal'}
            </button>

            {/* Quick Demo Credentials Switcher for Evaluators */}
            <div className="pt-4 border-t border-[#DDE5D4]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#588157] text-center mb-1">
                1-Click Demonstration Login
              </div>
              <p className="text-[10px] text-[#588157] text-center mb-2.5">
                Click any role below to instantly log in as that stakeholder
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('MP001', 'MP@123')}
                  className="p-2.5 border border-[#DDE5D4] rounded-xl hover:bg-[#FAF3E0] hover:border-[#E8DAB2] text-left transition-all bg-[#F8F9F7] cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="Click to sign in instantly as Member of Parliament"
                >
                  <div className="flex items-center gap-1 font-bold text-[#935D26]">
                    <Landmark className="w-3.5 h-3.5" />
                    <span>MP</span>
                  </div>
                  <div className="text-[10px] text-[#588157] font-mono">MP001</div>
                  <div className="text-[9px] text-[#935D26] font-semibold mt-1">1-Click Login →</div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('ADMIN001', 'Admin@123')}
                  className="p-2.5 border border-[#C8D5B9] rounded-xl hover:bg-[#EAF0E6] hover:border-[#395C40] text-left transition-all bg-[#EAF0E6]/50 cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="Click to sign in instantly as District Magistrate & Collector"
                >
                  <div className="flex items-center gap-1 font-bold text-[#1B3022]">
                    <Building2 className="w-3.5 h-3.5 text-[#395C40]" />
                    <span>Collector</span>
                  </div>
                  <div className="text-[10px] text-[#588157] font-mono">ADMIN001</div>
                  <div className="text-[9px] text-[#395C40] font-bold mt-1">1-Click Login →</div>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('AGENCY001', 'Agency@123')}
                  className="p-2.5 border border-[#DDE5D4] rounded-xl hover:bg-[#EAF0E6] hover:border-[#395C40] text-left transition-all bg-[#F8F9F7] cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                  title="Click to sign in instantly as Implementing Agency"
                >
                  <div className="flex items-center gap-1 font-bold text-[#1B3022]">
                    <UserCheck className="w-3.5 h-3.5 text-[#588157]" />
                    <span>Agency</span>
                  </div>
                  <div className="text-[10px] text-[#588157] font-mono">AGENCY001</div>
                  <div className="text-[9px] text-[#395C40] font-semibold mt-1">1-Click Login →</div>
                </button>
              </div>
            </div>

            {/* Citizen Open Access */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onEnterPublic}
                className="w-full py-2 bg-[#F8F9F7] hover:bg-[#EAF0E6] text-[#1B3022] font-bold rounded-lg border border-[#DDE5D4] transition-colors cursor-pointer"
              >
                Access as Public Citizen (Transparency View)
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B3022]/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-[#DDE5D4] space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#1B3022]">Official Password Reset Protocol</h3>
            <p className="text-[#588157] leading-relaxed">
              Under National Informatics Centre (NIC) security directives, MPLADS officer credentials can only be reset through your registered District Magistrate Administrative Office or Nodal Parliamentary Officer.
            </p>
            <div className="p-2.5 bg-[#EAF0E6] text-[#395C40] rounded-xl font-mono text-[11px] border border-[#C8D5B9]">
              Demo Mode: You can login using any of the quick-login buttons (MP001 / MP@123, ADMIN001 / Admin@123, AGENCY001 / Agency@123).
            </div>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-[#395C40] text-white rounded-lg font-bold hover:bg-[#2C4A34] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#DDE5D4] py-3 text-center text-xs text-[#588157]">
        <div>National Informatics Centre (NIC) &copy; {new Date().getFullYear()} Ministry of Statistics & Programme Implementation</div>
        <div className="text-[10px] text-[#A3B18A] mt-0.5">Designed for Smart India Hackathon (SIH) Evaluation</div>
      </footer>
    </div>
  );
};
