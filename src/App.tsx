import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// BASE_URL é injetado pelo Vite (default '/'; pode virar '/app/' se VITE_BASE='/app/')
const ROUTER_BASENAME = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined;
import { lazy, Suspense } from 'react';
import { AppShell } from './components/AppShell';
import { FilterProvider } from './contexts/FilterContext';

const RadarOverviewPage = lazy(() => import('./modules/inteligencia-politica/pages/RadarOverviewPage').then(m => ({ default: m.RadarOverviewPage })));
const AtoresListPage    = lazy(() => import('./modules/inteligencia-politica/pages/AtoresListPage').then(m => ({ default: m.AtoresListPage })));
const DrilldownPage     = lazy(() => import('./modules/inteligencia-politica/pages/DrilldownPage').then(m => ({ default: m.DrilldownPage })));
const PaidPage          = lazy(() => import('./modules/inteligencia-politica/pages/PaidPage').then(m => ({ default: m.PaidPage })));
const AnomaliesPage     = lazy(() => import('./modules/inteligencia-politica/pages/AnomaliesPage').then(m => ({ default: m.AnomaliesPage })));
const NewsPage          = lazy(() => import('./modules/inteligencia-politica/pages/NewsPage').then(m => ({ default: m.NewsPage })));
const AgentChatPage     = lazy(() => import('./modules/inteligencia-politica/pages/AgentChatPage').then(m => ({ default: m.AgentChatPage })));
const SystemPage        = lazy(() => import('./modules/inteligencia-politica/pages/SystemPage').then(m => ({ default: m.SystemPage })));
const PostsPage         = lazy(() => import('./modules/inteligencia-politica/pages/PostsPage').then(m => ({ default: m.PostsPage })));
const LoginPage         = lazy(() => import('./modules/inteligencia-politica/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ComparePage       = lazy(() => import('./modules/inteligencia-politica/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const HeatmapPage       = lazy(() => import('./modules/inteligencia-politica/pages/HeatmapPage').then(m => ({ default: m.HeatmapPage })));
const ClusterTimelinePage = lazy(() => import('./modules/inteligencia-politica/pages/ClusterTimelinePage').then(m => ({ default: m.ClusterTimelinePage })));
const ApuracaoPage      = lazy(() => import('./modules/inteligencia-politica/pages/ApuracaoPage').then(m => ({ default: m.ApuracaoPage })));
const DiagnoseHistoryPage = lazy(() => import('./modules/inteligencia-politica/pages/DiagnoseHistoryPage').then(m => ({ default: m.DiagnoseHistoryPage })));

function PageFallback() {
  return <div className='p-12 text-zinc-500 text-sm'>carregando…</div>;
}

export default function App() {
  return (
    <FilterProvider><BrowserRouter basename={ROUTER_BASENAME}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/*' element={<ShellWrap />} />
        </Routes>
      </Suspense>
    </BrowserRouter></FilterProvider>
  );
}

function ShellWrap() {
  return (
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
          <Route path='/system' element={<SystemPage />} />
          <Route path='/posts' element={<PostsPage />} />
          <Route path='/comparar' element={<ComparePage />} />
          <Route path='/heatmap' element={<HeatmapPage />} />
          <Route path='/clusters' element={<ClusterTimelinePage />} />
          <Route path='/apuracao' element={<ApuracaoPage />} />
          <Route path='/diagnoses' element={<DiagnoseHistoryPage />} />
          <Route path='*' element={<div className='p-8 text-zinc-500'>404 — rota não encontrada</div>} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
