import React, { useState } from 'react';
import { X, Zap, Mail, Lock, User, Terminal, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from './Button';

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuth, openAuth, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(authModalMode !== 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  if (!authModalOpen) return null;

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
          bio: bio || undefined,
        });
      }
      closeAuth();
    } catch (err) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#22201D]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-lg bg-[#FAF5EB] border-2 border-[#C9BDAA] shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Ruled Drafting Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D87535]" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b border-[#C9BDAA]/50 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D87535]">
            <ShieldCheck className="w-4 h-4 text-[#D87535]" />
            <span className="uppercase tracking-widest font-bold">
              {isLogin ? '// SECURITY ACCESS GATEWAY' : '// ENGINEER ENROLLMENT'}
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

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3 rounded bg-[#B95D32]/10 border border-[#B95D32]/30 flex items-start gap-2.5 text-xs text-[#B95D32] font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-[#655F55] uppercase text-[10px] tracking-wider">
                  Engineer Full Name
                </label>
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
                <label className="text-[#655F55] uppercase text-[10px] tracking-wider">
                  Engineering Handle (Username)
                </label>
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
            <label className="text-[#655F55] uppercase text-[10px] tracking-wider">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
              <input
                type="email"
                required
                placeholder="engineer@microverse.lab"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF5EB] border border-[#C9BDAA] focus:border-[#D87535] rounded pl-9 pr-3 py-2 text-[#22201D] placeholder-[#8C8275]/60 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#655F55] uppercase text-[10px] tracking-wider">
              Access Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8275]" />
              <input
                type="password"
                required
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
            className="w-full py-2.5 mt-2 flex items-center justify-center gap-2 font-bold"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isLogin ? (
              <>
                <span>Access Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Enroll Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[10px] font-mono text-[#8C8275]">
          {isLogin ? (
            <span>
              New engineer?{' '}
              <button
                type="button"
                onClick={() => switchMode(false)}
                className="text-[#D87535] hover:underline font-semibold cursor-pointer"
              >
                Enroll new account
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
                Sign in with existing credentials
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

