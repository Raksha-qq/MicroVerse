import React, { useState } from 'react';
import { X, Mail, Lock, User, Terminal, AlertCircle, ArrowRight, ShieldCheck, Loader2, Wifi } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuth, login, register } = useAuth();
  if (!authModalOpen) return null;

  return (
    <AuthModalContent
      key={authModalMode}
      authModalMode={authModalMode}
      closeAuth={closeAuth}
      login={login}
      register={register}
    />
  );
}

function AuthModalContent({ authModalMode, closeAuth, login, register }) {
  const [isLogin, setIsLogin] = useState(authModalMode !== 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendWaking, setBackendWaking] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          username: username || undefined,
        });
      }
      closeAuth();
    } catch (err) {
      const msg = err.message || 'Authentication failed.';
      // Detect backend cold-start scenario
      if (msg.includes('starting up') || msg.includes('invalid response') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setBackendWaking(true);
        setError('The backend server is waking up (Render free tier). Please wait 30–60 seconds and try again.');
      } else {
        setBackendWaking(false);
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setError(null);
    setBackendWaking(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#22201D]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuth}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-[#FAF5EB] border-2 border-[#C9BDAA] shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D87535]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#C9BDAA]/50 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D87535]">
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase tracking-widest font-bold">
              {isLogin ? '// ACCESS GATEWAY' : '// ENGINEER ENROLLMENT'}
            </span>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 rounded text-[#8C8275] hover:text-[#22201D] hover:bg-[#EDE1CE] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded bg-[#EDE1CE] border border-[#C9BDAA] text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={`py-1.5 rounded font-semibold transition-all cursor-pointer ${
              isLogin
                ? 'bg-[#FAF5EB] text-[#D87535] shadow-xs border border-[#C9BDAA]'
                : 'text-[#655F55] hover:text-[#22201D]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={`py-1.5 rounded font-semibold transition-all cursor-pointer ${
              !isLogin
                ? 'bg-[#FAF5EB] text-[#D87535] shadow-xs border border-[#C9BDAA]'
                : 'text-[#655F55] hover:text-[#22201D]'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error / Wakeup Banner */}
        {error && (
          <div className={`p-3 rounded border flex items-start gap-2.5 text-xs font-mono ${
            backendWaking
              ? 'bg-[#D87535]/10 border-[#D87535]/30 text-[#D87535]'
              : 'bg-[#B95D32]/10 border-[#B95D32]/30 text-[#B95D32]'
          }`}>
            {backendWaking
              ? <Wifi className="w-4 h-4 shrink-0 mt-0.5 animate-pulse" />
              : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            }
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-[#655F55] uppercase text-[10px] tracking-wider">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded pl-9 pr-3 py-2 text-[#22201D] placeholder-[#8C8275]/60 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#655F55] uppercase text-[10px] tracking-wider">Username (optional)</label>
                <div className="relative">
                  <Terminal className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
                  <input
                    type="text"
                    placeholder="e.g. alex_embedded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded pl-9 pr-3 py-2 text-[#22201D] placeholder-[#8C8275]/60 outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[#655F55] uppercase text-[10px] tracking-wider">Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
              <input
                type="email"
                required
                placeholder="engineer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded pl-9 pr-3 py-2 text-[#22201D] placeholder-[#8C8275]/60 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#655F55] uppercase text-[10px] tracking-wider">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded pl-9 pr-3 py-2 text-[#22201D] placeholder-[#8C8275]/60 outline-none transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-2.5 mt-1 flex items-center justify-center gap-2 font-bold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting to Laboratory...</span>
              </>
            ) : isLogin ? (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="pt-1 text-center text-[10px] font-mono text-[#8C8275]">
          {isLogin ? (
            <span>
              No account yet?{' '}
              <button
                type="button"
                onClick={() => switchMode(false)}
                className="text-[#D87535] hover:underline font-semibold cursor-pointer"
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode(true)}
                className="text-[#D87535] hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* Backend status note */}
        <div className="text-[9px] font-mono text-[#C9BDAA] text-center border-t border-[#C9BDAA]/30 pt-2">
          Backend on Render free tier — may need 30s to wake on first use.
        </div>
      </div>
    </div>
  );
}
