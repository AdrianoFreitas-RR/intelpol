import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppShell } from './components/AppShell';

const RadarOverviewPage = lazy(() => import('./modules/inteligencia-politica/pages/RadarOverviewPage').then(m => ({ default: m.RadarOverviewPage })));
const AtoresListPage    = lazy(() => import('./modules/inteligencia-politica/pages/AtoresListPage').then(m => ({ default: m.AtoresListPage })));
const DrilldownPage     = lazy(() => import('./modules/inteligencia-politica/pages/DrilldownPage').then(m => ({ default: m.DrilldownPage })));
const PaidPage          = lazy(() => import('./modules/inteligencia-politica/pages/PaidPage').then(m => ({ default: m.PaidPage })));
const AnomaliesPage     = lazy(() => import('./modules/inteligencia-politica/pages/AnomaliesPage').then(m => ({ default: m.AnomaliesPage })));
const NewsPage          = lazy(() => import('./modules/inteligencia-politica/pages/NewsPage').then(m => ({ default: m.NewsPage })));
const AgentChatPage     = lazy(() => import('./modules/inteligencia-politica/pages/AgentChatPage').then(m => ({ default: m.AgentChatPage })));

function PageFallback() {
  return <div className='p-12 text-zinc-500 text-sm'>carregando…</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path='/' element={<Navigate to='/overview' replace />} />
            <Route path='/overview' element={<RadarOverviewPage />} />
            <Route path='/atores' element={<AtoresListPage />} />
            <Route path='/atores/:id' element={<DrilldownPage />} />
            <Route path='/paid' element={<PaidPage />} />
            <Route path='/anomalias' element={<AnomaliesPage />} />
            <Route path='/news' element={<NewsPage />} />
            <Route path='/agent' element={<AgentChatPage />} />
            <Route path='*' element={<div className='p-8 text-zinc-500'>404 — rota não encontrada</div>} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
