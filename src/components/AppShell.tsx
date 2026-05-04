import { type ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AgentDock } from './AgentDock';

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(v => !v)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onAgentToggle={() => setAgentOpen(v => !v)} agentOpen={agentOpen} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <AgentDock open={agentOpen} onClose={() => setAgentOpen(false)} />
    </div>
  );
}
