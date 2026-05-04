# IntelPol — Radar IP-RR

Inteligência Política Digital de Roraima. Frontend React+Vite+TypeScript que consome a API FastAPI no agserver via Tailscale Funnel.

**Status:** v0.7 MVP em construção (lançamento previsto 18/05/2026 antes do início da campanha eleitoral suplementar 21/06).

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **TanStack Query 5** (data fetching + cache)
- **Tailwind CSS 3** (design system Liquid Glass dark)
- **Plus Jakarta Sans** + **JetBrains Mono**
- Dependências MVP: lucide-react, react-router-dom

## Backend

API FastAPI rodando no agserver com:
- DuckDB analítico (~268KB com 13 atores, 12.575 posts, 19.237 ads, 16.567 votos TSE)
- Qdrant vector DB (12k embeddings nomic-embed-text 768D)
- Ollama Qwen3 32B (LLM enrichment overnight)
- 11 endpoints REST: `/api/health`, `/api/atores`, `/api/overview`, `/api/drilldown/:id`, `/api/paid`, `/api/anomalies`, `/api/search/semantic`, `/api/ituassu`, `/api/cross-cycle`, `/api/framing`

Exposto publicamente via **Tailscale Funnel** em `https://agllmserver.tail0ba0ff.ts.net/api/...`

## Local dev

```bash
npm install
npm run dev   # http://localhost:5173
```

Configure `.env.local`:
```
VITE_RADAR_API_URL=http://127.0.0.1:3334    # tailnet (com Tailscale conectado)
# ou
VITE_RADAR_API_URL=https://agllmserver.tail0ba0ff.ts.net   # público
```

## Deploy

Vercel via `git push`. Domínio padrão: `intelpol.vercel.app` (futuro: `radar.agcomunicacao.com.br`).

## Roadmap

- **v0.7 MVP (18/05)**: 4 telas críticas — Overview, Drill-down, Paid, Anomalias
- **v1.1 (19/05–20/06)**: Telas 3, 4, 6, 7, 8, 9 incrementais + AgentDock
- **Sprint 7-A (21/06)**: Modo Eleição Suplementar (TSE Divulgação live)

Documentação completa: vault Obsidian `AG/Sistema/Dashboards/`.
