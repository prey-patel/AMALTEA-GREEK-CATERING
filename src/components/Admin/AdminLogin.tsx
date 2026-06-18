import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  lang: 'en' | 'pl';
  t: (key: string) => string;
}

export default function AdminLogin({ onLoginSuccess, lang, t: _t }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const user = data.user;
      if (!user) throw new Error('No user data returned');

      // Check if user is registered in admin_users
      const { data: adminData, error: adminQueryError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (adminQueryError) {
        await supabase.auth.signOut();
        throw new Error(lang === 'pl' ? 'Błąd autoryzacji bazy danych.' : 'Database authorization error.');
      }

      if (!adminData || adminData.role !== 'owner') {
        await supabase.auth.signOut();
        throw new Error(lang === 'pl' ? 'Brak uprawnień administratora.' : 'Unauthorized: Administrator access required.');
      }

      // Log the login via secure RPC
      await supabase.rpc('log_admin_action', {
        action: 'LOGIN',
        target_table: 'auth.users',
        target_id: user.id,
        metadata: { client: 'web-browser' }
      });

      onLoginSuccess();
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(lang === 'pl' ? 'Wystąpił nieznany błąd logowania.' : 'An unknown login error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FAF8F5] dark:bg-slate-900 border border-[#C5A880]/30 p-8 rounded-lg shadow-xl relative overflow-hidden">
        
        {/* Classical design overlay ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C5A880]/40 m-2" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C5A880]/40 m-2" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C5A880]/40 m-2" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C5A880]/40 m-2" />

        <div className="text-center space-y-4">
          <div className="flex justify-center text-[#C5A880] select-none">
            <svg className="w-16 h-8 fill-currentColor" viewBox="0 0 24 24">
              <path d="M12 21a9 9 0 0 1-5.65-2.02l.65-.76A8 8 0 0 0 12 20a8 8 0 0 0 7-4.13l.87.5A9 9 0 0 1 12 21zm-7-6.2a8.88 8.88 0 0 1-.5-2.8c0-3 1.8-5.7 4.5-6.83l.38.92A8 8 0 0 0 5.5 12a8 8 0 0 0 .42 2.5l-.92.3zM19 12a8 8 0 0 0-3.88-6.91l.38-.92c2.7 1.13 4.5 3.83 4.5 6.83a8.88 8.88 0 0 1-.5 2.8l-.92-.3a8 8 0 0 0 .42-2.5z" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl font-light tracking-wider text-slate-900 dark:text-white uppercase">
            {lang === 'pl' ? 'Panel Administratora' : 'Admin Portal'}
          </h2>
          <p className="text-xs font-sans tracking-[0.2em] text-[#C5A880] uppercase">
            AMALTEA GREEK CATERING
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email-address" className="font-mono text-xs uppercase tracking-wider text-[#C5A880] block mb-1.5">
                {lang === 'pl' ? 'Email Administratora' : 'Admin Email'}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] text-sm"
                placeholder="admin@amaltea.com.pl"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-mono text-xs uppercase tracking-wider text-[#C5A880] block mb-1.5">
                {lang === 'pl' ? 'Hasło' : 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-mono rounded">
              ⚠️ {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-[#C5A880] text-xs font-mono font-bold tracking-widest text-[#0A1128] bg-gradient-to-r from-[#C5A880] via-[#E2D1B6] to-[#C5A880] hover:from-[#BCA075] hover:to-[#BCA075] uppercase cursor-pointer disabled:opacity-55 transition-all shadow-md"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#0A1128] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{lang === 'pl' ? 'ZALOGUJ SIĘ' : 'SIGN IN'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
