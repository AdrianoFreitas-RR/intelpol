import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useAgentChat } from '../modules/inteligencia-politica/hooks/useRadar';
import type { AgentChatMessage } from '../modules/inteligencia-politica/api/client';

export function AgentDock({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chat = useAgentChat();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, chat.isPending]);

  if (!open) return null;

  const send = () => {
    if (!input.trim() || chat.isPending) return;
    const next: AgentChatMessage[] = [...messages, { role: 'user', content: input.trim() }];
    setMessages(next); setInput('');
    chat.mutate({ messages: next }, {
      onSuccess: r => setMessages(m => [...m, { role: 'assistant', content: r.reply }]),
    });
  };

  return (
    <aside className='w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col'>
      <div className='h-16 px-4 flex items-center justify-between border-b border-zinc-800'>
        <div className='flex items-center gap-2'>
          <Sparkles size={16} className='text-orange-400' />
          <div className='font-medium text-sm'>AgentDock</div>
          <span className='text-[10px] text-zinc-500'>Sonnet 4.6</span>
        </div>
        <button onClick={onClose} className='text-zinc-500 hover:text-zinc-200'><X size={18} /></button>
      </div>

      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {messages.length === 0 && (
          <div className='text-zinc-500 text-xs space-y-2'>
            <p>Pergunte algo sobre o cenário político RR.</p>
            <p className='text-zinc-600'>Ex: "Qual o ator com maior alta em paid esta semana?"</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role==='user' ? 'justify-end':'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role==='user' ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800 text-zinc-100'
            }`}>{m.content}</div>
          </div>
        ))}
        {chat.isPending && <div className='text-zinc-500 text-xs italic'>pensando…</div>}
        {chat.error && <div className='text-red-400 text-xs'>erro: {chat.error.message}</div>}
        <div ref={endRef} />
      </div>

      <div className='p-3 border-t border-zinc-800 flex gap-2'>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder='Pergunte…'
          className='flex-1 bg-zinc-950 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500' />
        <button onClick={send} disabled={!input.trim()||chat.isPending}
          className='bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-zinc-950 px-3 rounded'>
          <Send size={14} />
        </button>
      </div>
    </aside>
  );
}
