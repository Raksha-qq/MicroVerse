import React, { useState } from 'react';
import { X, Zap, Mail, Lock, User, Terminal, AlertCircle, ArrowRight } from 'lucide-react';
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
        await login({ email, password });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#111E30] border border-[#55C7FF]/40 shadow-[0_0_50px_rgba(85,199,255,0.2)] p-6 sm:p-8 space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#55C7FF] to-transparent" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#55C7FF]">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="uppercase tracking-widest">
              {isLogin ? 'Security Access Gateway' : 'Engineer Enrollment'}
            </span>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 rounded-lg text-[#8FA6BC] hover:text-[#EAF5FF] hover:bg-[#192B40] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-lg bg-[#0B1220] border border-[#192B40] text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={`py-2 rounded-md font-semibold transition-all cursor-pointer ${
              isLogin
                ? 'bg-[#192B40] text-[#55C7FF] shadow-[0_0_10px_rgba(85,199,255,0.2)]'
                : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={`py-2 rounded-md font-semibold transition-all cursor-pointer ${
              !isLogin
                ? 'bg-[#192B40] text-[#55C7FF] shadow-[0_0_10px_rgba(85,199,255,0.2)]'
                : 'text-[#8FA6BC] hover:text-[#EAF5FF]'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/40 flex items-start gap-2.5 text-xs text-[#EF4444] font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-[#8FA6BC] uppercase text-[10px] tracking-wider">
                  Engineer Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-9 pr-3 py-2 text-[#EAF5FF] placeholder-[#8FA6BC]/50 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#8FA6BC] uppercase text-[10px] tracking-wider">
                  Engineering Handle (Username)
                </label>
                <div className="relative">
                  <Terminal className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
                  <input
                    type="text"
                    placeholder="e.g. alex_embedded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-9 pr-3 py-2 text-[#EAF5FF] placeholder-[#8FA6BC]/50 outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-[#8FA6BC] uppercase text-[10px] tracking-wider">
              Engineering Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
              <input
                type="email"
                required
                placeholder="engineer@microverse.lab"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-9 pr-3 py-2 text-[#EAF5FF] placeholder-[#8FA6BC]/50 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#8FA6BC] uppercase text-[10px] tracking-wider">
              Security Passphrase
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA6BC]" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg pl-9 pr-3 py-2 text-[#EAF5FF] placeholder-[#8FA6BC]/50 outline-none transition-colors"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[#8FA6BC] uppercase text-[10px] tracking-wider">
                Specialization / Bio (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Firmware & TinyML Explorer"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#0B1220] border border-[#192B40] focus:border-[#55C7FF] rounded-lg px-3 py-2 text-[#EAF5FF] placeholder-[#8FA6BC]/50 outline-none transition-colors"
              />
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full justify-center"
              icon={ArrowRight}
            >
              {loading
                ? 'VERIFYING CREDENTIALS...'
                : isLogin
                ? 'AUTHENTICATE SESSION'
                : 'INITIALIZE ACCOUNT'}
            </Button>
          </div>
        </form>

        {/* Demo Credentials Hint */}
        <div className="p-3 rounded-lg bg-[#0B1220]/60 border border-[#192B40] text-[10px] font-mono text-[#8FA6BC] space-y-1">
          <div className="text-[#55C7FF] font-semibold">PRE-CONFIGURED DEMO CREDENTIALS:</div>
          <div>Admin: <span className="text-[#EAF5FF]">admin@microverse.lab</span> / <span className="text-[#EAF5FF]">AdminPass123!</span></div>
          <div>User: <span className="text-[#EAF5FF]">engineer@microverse.lab</span> / <span className="text-[#EAF5FF]">Engineer123!</span></div>
        </div>
      </div>
    </div>
  );
}

