import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { RadarOverviewPage } from './modules/inteligencia-politica/pages/RadarOverviewPage';
import { AtoresListPage } from './modules/inteligencia-politica/pages/AtoresListPage';
import { DrilldownPage } from './modules/inteligencia-politica/pages/DrilldownPage';
import { PaidPage } from './modules/inteligencia-politica/pages/PaidPage';
import { AnomaliesPage } from './modules/inteligencia-politica/pages/AnomaliesPage';
import { NewsPage } from './modules/inteligencia-politica/pages/NewsPage';
import { AgentChatPage } from './modules/inteligencia-politica/pages/AgentChatPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<RadarOverviewPage />} />
          <Route path="/atores" element={<AtoresListPage />} />
          <Route path="/atores/:id" element={<DrilldownPage />} />
          <Route path="/paid" element={<PaidPage />} />
          <Route path="/anomalias" element={<AnomaliesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/agent" element={<AgentChatPage />} />
          <Route path="*" element={<div className='p-8 text-zinc-500'>404 — rota não encontrada</div>} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
