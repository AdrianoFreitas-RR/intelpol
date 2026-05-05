import { useState } from 'react';
import { Lock } from 'lucide-react';
import { loginToken } from '../api/client';

export function LoginPage() {
  const [token, setToken] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      const ok = await loginToken(token);
      if (ok) { window.location.href = '/app/overview'; return; }
      setErr('Token invalido.');
    } catch (e: any) {
      setErr(e?.message ?? 'Falha de conexao.');
    } finally { setLoading(false); }
  };

  return (
    <div className='min-h-screen bg-zinc-950 flex items-center justify-center px-4'>
      <form onSubmit={submit} className='w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-4'>
        <div className='flex items-center gap-2 mb-2'>
          <Lock size={20} className='text-orange-400' />
          <h1 className='text-xl font-semibold text-zinc-100'>IntelPol RR</h1>
        </div>
        <p className='text-xs text-zinc-500'>Centro de Inteligencia Politica - Acesso restrito</p>
        <input
          type='password'
          autoFocus
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder='Token de acesso'
          className='w-full bg-zinc-950 border border-zinc-700 rounded px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-orange-500'
        />
        {err && <div className='text-xs text-red-400'>{err}</div>}
        <button type='submit' disabled={loading || !token}
          className='w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-zinc-950 font-medium py-3 rounded'>
          {loading ? 'Validando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
