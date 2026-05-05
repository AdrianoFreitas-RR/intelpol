import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; fallbackTitle?: string; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error('ErrorBoundary:', error); }

  reset = () => { this.setState({ error: null }); };

  render() {
    if (this.state.error) {
      return (
        <div className='p-8 max-w-2xl mx-auto'>
          <div className='bg-red-950/20 border border-red-900/40 rounded-xl p-6 text-zinc-100'>
            <div className='flex items-center gap-2 mb-3'>
              <AlertTriangle className='text-red-400' size={20} />
              <h2 className='text-lg font-semibold'>{this.props.fallbackTitle ?? 'Algo quebrou'}</h2>
            </div>
            <p className='text-sm text-zinc-400 mb-4'>{this.state.error.message}</p>
            <div className='flex gap-2'>
              <button onClick={this.reset} className='px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 rounded'>Tentar novamente</button>
              <button onClick={() => window.location.reload()} className='px-4 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-zinc-950 rounded'>Recarregar pagina</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
