import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAgentChat } from '../hooks/useRadar';
import type { AgentChatMessage } from '../api/client';

export function AgentChatPage() {
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chat = useAgentChat();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = () => {
    if (!input.trim() || chat.isPending) return;
    const next: AgentChatMessage[] = [...messages, { role: 'user', content: input.trim() }];
    setMessages(next);
    setInput('');
    chat.mutate({ messages: next }, {
      onSuccess: (r) => setMessages(m => [...m, { role: 'assistant', content: r.reply }]),
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-orange-400" size={20} />
        <h2 className="text-2xl font-semibold">AgentDock</h2>
        <span className="text-xs text-zinc-500">Sonnet 4.6 · contexto IntelPol-RR</span>
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-zinc-500 text-sm text-center py-12">
            Pergunte algo. Exemplos: <br/>
            <span className="text-zinc-400">"Qual o cenário de Roraima esta semana?"</span> · <span className="text-zinc-400">"Resuma o paid de Hiran nos últimos 30d"</span>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role==='user' ? 'justify-end':'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
              m.role==='user' ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-800 text-zinc-100'
            }`}>{m.content}</div>
          </div>
        ))}
        {chat.isPending && <div className="text-zinc-500 text-xs">pensando…</div>}
        {chat.error && <div className="text-red-400 text-xs">erro: {chat.error.message}</div>}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
          placeholder="Pergunte algo sobre o cenário político RR…"
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500" />
        <button onClick={send} disabled={!input.trim()||chat.isPending}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-zinc-950 px-4 rounded-lg flex items-center gap-2">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
