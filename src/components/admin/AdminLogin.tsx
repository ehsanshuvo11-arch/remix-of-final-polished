import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Temporary dummy auth for local testing (no backend call).
const DUMMY_EMAIL = 'admin@polished.com';
const DUMMY_PASSWORD = 'admin';
export const DUMMY_AUTH_KEY = 'polished_dummy_admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (submitting) return;
    setLoginError('');
    setLoginSuccess('');
    setSubmitting(true);

    if (email.trim().toLowerCase() === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      localStorage.setItem(DUMMY_AUTH_KEY, 'true');
      setLoginSuccess('Login successful — redirecting…');
      setTimeout(() => navigate('/admin/dashboard'), 700);
      return;
    }

    setLoginError('Invalid credentials');
    setSubmitting(false);
  };


  return (
    <div className="min-h-screen bg-polished-dark-blue flex items-center justify-center p-6 relative overflow-hidden">
      {/* subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, hsl(var(--accent) / 0.08), transparent 55%)',
        }}
      />

      <div className="relative w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl text-primary-foreground font-light tracking-[6px]">
            POLISHED<span className="text-accent">.</span>
          </h1>
          <p className="mt-3 text-[10px] tracking-[4px] uppercase text-primary-foreground/40">
            Admin Console
          </p>
        </div>

        <div className="bg-primary-foreground/[0.03] border border-primary-foreground/10 rounded-sm p-10 backdrop-blur-sm">
          <h2 className="text-[11px] tracking-[3px] uppercase text-primary-foreground/60 mb-6 text-center">
            Sign In
          </h2>

          <label className="block text-[10px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-4 py-3 text-sm outline-none rounded-sm mb-5 placeholder:text-primary-foreground/25 focus:border-accent transition-colors duration-300"
            placeholder="you@polished.com"
          />

          <label className="block text-[10px] tracking-[2px] uppercase text-primary-foreground/40 mb-2">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-primary-foreground/5 border border-primary-foreground/10 text-primary-foreground px-4 py-3 text-sm outline-none rounded-sm mb-2 placeholder:text-primary-foreground/25 focus:border-accent transition-colors duration-300"
            placeholder="••••••••"
          />

          {loginError && (
            <p className="text-accent/90 text-xs mt-3 mb-1 tracking-wide">{loginError}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={submitting}
            className="w-full mt-6 py-3.5 bg-accent text-primary text-[11px] font-medium tracking-[3px] uppercase rounded-sm transition-all duration-300 ease-in-out hover:shadow-[0_0_18px_rgba(251,146,60,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in…' : 'Enter Console'}
          </button>
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[3px] uppercase text-primary-foreground/30">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
