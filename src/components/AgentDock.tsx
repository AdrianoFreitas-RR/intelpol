import { X } from 'lucide-react';
export function AgentDock({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <aside className="w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col">
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800">
        <div className="font-medium">AgentDock</div>
        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200"><X size={18} /></button>
      </div>
      <div className="flex-1 p-4 text-sm text-zinc-500">
        Chat IA chega no D3. Por enquanto, vai em /agent para testar.
      </div>
    </aside>
  );
}
