/**
 * Radar IP-RR — Cliente API
 * Conecta o frontend ao backend FastAPI no agserver.
 *
 * Dev:  VITE_RADAR_API_URL=http://10.10.1.22:3334  (Tailscale)
 * Prod: VITE_RADAR_API_URL=https://api.radar.agcomunicacao.com.br
 */

const BASE_URL = import.meta.env.VITE_RADAR_API_URL || "http://10.10.1.22:3334";

export class RadarAPIError extends Error {
  status: number;
  detail?: unknown;
  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "RadarAPIError";
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let detail: unknown = undefined;
    try {
      detail = await res.json();
    } catch {
      detail = await res.text();
    }
    throw new RadarAPIError(
      `${options.method || "GET"} ${path} → HTTP ${res.status}`,
      res.status,
      detail,
    );
  }

  return res.json();
}

export const radarAPI = {
  health: () => request<HealthResponse>("/api/health"),
  atores: (prioridade?: "alta" | "baixa") =>
    request<{ data: Ator[] }>(
      `/api/atores${prioridade ? `?prioridade=${prioridade}` : ""}`,
    ),
  ator: (atorId: string) =>
    request<{ ator: Ator; history: AtorHistoryEntry[] }>(
      `/api/atores/${encodeURIComponent(atorId)}`,
    ),
  overview: (period: string = "30d") =>
    request<OverviewResponse>(`/api/overview?period=${period}`),
  drilldown: (atorId: string, period: string = "60d") =>
    request<DrilldownResponse>(
      `/api/drilldown/${encodeURIComponent(atorId)}?period=${period}`,
    ),
  paid: (period: string = "30d") =>
    request<PaidResponse>(`/api/paid?period=${period}`),
  anomalies: (period: string = "90d", severity?: string) =>
    request<AnomaliesResponse>(
      `/api/anomalies?period=${period}${severity ? `&severity=${severity}` : ""}`,
    ),
  searchSemantic: (query: string, limit: number = 15) =>
    request<SemanticResponse>("/api/search/semantic", {
      method: "POST",
      body: JSON.stringify({ query, limit }),
    }),
  ituassu: () => request<IturassuResponse>("/api/ituassu"),
  crossCycle: (anoMin: number = 2014, anoMax: number = 2026) =>
    request<CrossCycleResponse>(
      `/api/cross-cycle?ano_min=${anoMin}&ano_max=${anoMax}`,
    ),
  framing: (minPosts: number = 20) =>
    request<FramingResponse>(`/api/framing?min_posts=${minPosts}`),
};

// Tipos do backend (parcial — ver /api/docs para schema completo)

export interface HealthResponse {
  status: "ok";
  version: string;
  ts: string;
  duckdb_size_kb: number;
  row_counts: Record<string, number>;
}

export interface Ator {
  ator_id: string;
  nome: string;
  nome_curto: string | null;
  papel: string | null;
  tipo: string;
  cargo_atual: string | null;
  partido_atual: string | null;
  status_eleitoral: string | null;
  nivel_federativo: string | null;
  bloco_ideologico: string | null;
  primeira_eleicao_ano: number | null;
  n_mandatos: number | null;
  flag_renovacao: boolean | null;
  prioridade_monitoramento: string | null;
  fb_followers_snapshot: number | null;
  ig_followers_snapshot: number | null;
  yt_subs_snapshot: number | null;
  ads_total_historico: number | null;
  ads_na_janela: number | null;
  ads_spend_hi: number | null;
}

export interface AtorHistoryEntry {
  ator_id: string;
  valid_from: string;
  valid_to: string | null;
  cargo: string | null;
  partido: string | null;
  status_eleitoral: string | null;
  nivel_federativo: string | null;
  bloco_ideologico: string | null;
  evento_origem: string | null;
  fonte: string | null;
}

export interface OverviewResponse {
  period: string;
  kpis: {
    atores: number;
    alcance_total: number;
    paid_total: number;
    ads_janela: number;
  };
  heatmap: Array<{
    ator_id: string;
    nome_curto: string;
    alcance: number;
    paid: number;
    posts_total: number;
    engajamento: number;
  }>;
  ranking: Array<{
    ator_id: string;
    nome_curto: string;
    partido_atual: string | null;
    bloco_ideologico: string | null;
    followers: number;
    paid_total: number;
    ads_count: number;
  }>;
}

export interface DrilldownResponse {
  ator: Ator;
  history: AtorHistoryEntry[];
  tse_historico: Array<{
    ano: number;
    cargo: string;
    partido_sigla: string;
    votos_total: number;
    situacao_total: string;
  }>;
  tabs: {
    visao_geral: {
      kpis: {
        posts: number;
        engagement: number;
        likes_total: number;
        comments_total: number;
      };
      top_posts: Array<{
        post_id: string;
        plataforma: string;
        tipo: string;
        texto: string | null;
        link: string | null;
        imagem: string | null;
        likes: number | null;
        comments: number | null;
        shares: number | null;
        interactions: number | null;
        data_dt: string | null;
      }>;
    };
    paid: {
      kpis: { n_ads: number; spend_total: number; impressions_total: number };
      demographic_fingerprint: Array<{ age_bucket: string; gender: string; pct_medio: number; n_ads: number }>;
      regions: Array<{ region: string; pct_medio: number; n_ads: number }>;
    };
  };
}

export interface PaidResponse {
  period: string;
  kpis: { n_ads_total: number; spend_total: number; hhi_concentration: number; top_spender: string | null };
  ranking: Array<{ ator_label: string; n_ads: number; spend_total: number; imp_total: number }>;
  demographic_fingerprint_agregado: Array<{ age_bucket: string; gender: string; pct_medio: number; n_ads: number; n_atores: number }>;
  regions_agregado: Array<{ region: string; pct_medio: number; n_ads: number }>;
}

export interface AnomaliesResponse {
  period: string;
  severity_filter: string | null;
  n_total: number;
  data: Array<{ ator_id: string; plataforma: string; metric: string; data_d?: string; value: number; mean14: number; std14: number; zscore: number; severity: string }>;
}

export interface SemanticResponse {
  query: string; limit: number; n_results: number;
  results: Array<{ score: number; ator_id: string | null; plataforma: string | null; data: string | null; tipo: string | null; texto: string | null; interactions: number | null }>;
}

export interface IturassuResponse {
  indices: Array<{ ator_id: string; nome_curto: string; partido_atual: string | null; bloco_ideologico: string | null; primeira_eleicao_ano: number | null; n_mandatos: number | null; flag_renovacao: boolean | null; interactions_total: number; posts_total: number; spend_total: number; mo: number; md: number; ief: number; int_fb: number; int_ig: number; ads_pct: number; delta_md_mo: number }>;
  r2_md_vs_mo: number | null;
  hipoteses: Array<{ id: string; tema: string; valor: number | null; interpretacao: string }>;
}

export interface CrossCycleResponse {
  ano_min: number; ano_max: number;
  timeline_paid: Array<{ ator_label: string; ano: number; n_ads: number; spend_total: number; meses_ativos: number }>;
  persistencia: Array<{ ator_label: string; anos_com_paid: number; primeiro_ano: number; ultimo_ano: number; span_anos: number; spend_acumulado: number; ads_acumulado: number }>;
  tse_resultados: Array<{ ator_id: string; nome_curto: string; ano: number; cargo: string; partido_sigla: string; votos_total: number; situacao_total: string }>;
}

export interface FramingResponse {
  min_posts_filter: number; n_clusters: number;
  clusters: Array<{ cluster_id: number; n_posts: number; label: string; top_keywords: string }>;
  ator_por_cluster: Array<{ cluster_id: number; ator_id: string; n: number; rk: number }>;
  cluster_por_ator: Array<{ ator_id: string; cluster_id: number; n: number; rk: number }>;
}

// ============== NEWS endpoints ==============
export interface NewsItem {
  url: string;
  fonte: string;
  titulo: string;
  lead: string;
  data_pub: string | null;
  capturado_em: string;
  origem: string;
  atores_match: string[];
  temas_match: string[];
}
export interface NewsListResponse {
  total: number; limit: number; offset: number;
  data: NewsItem[];
}
export interface NewsStatsResponse {
  period: string; total: number;
  atores: Array<{ ator_id: string; n: number }>;
  temas: Array<{ tema: string; n: number }>;
  fontes: Array<{ fonte: string; n: number }>;
}

// ============== AGENT endpoints ==============
export interface AgentDiagnoseResponse {
  ator_id: string; period: string; model: string;
  usage: { input_tokens: number; output_tokens: number };
  diagnostico: string;
}
export interface AgentChatMessage { role: 'user'|'assistant'; content: string; }
export interface AgentChatResponse {
  model: string; reply: string;
  usage: { input_tokens: number; output_tokens: number };
}
export interface AgentLabelsResponse {
  model: string; label: string;
  usage: { input_tokens: number; output_tokens: number };
}

// Estende objeto radarAPI
Object.assign(radarAPI, {
  news: (params: { ator_id?: string; tema?: string; fonte?: string; period?: string; limit?: number; offset?: number } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => v!==undefined && qs.set(k, String(v)));
    return request<NewsListResponse>(`/api/news${qs.toString() ? '?'+qs : ''}`);
  },
  newsStats: (period: string = '30d') =>
    request<NewsStatsResponse>(`/api/news/stats?period=${period}`),
  agentDiagnose: (ator_id: string, period: string = '30d', contexto_extra?: string) =>
    request<AgentDiagnoseResponse>('/api/agent/diagnose', {
      method: 'POST',
      body: JSON.stringify({ ator_id, period, contexto_extra }),
    }),
  agentChat: (messages: AgentChatMessage[], contexto_ator_id?: string, max_tokens: number = 800) =>
    request<AgentChatResponse>('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, contexto_ator_id, max_tokens }),
    }),
  agentLabels: (keywords: string[], n_posts?: number, contexto?: string) =>
    request<AgentLabelsResponse>('/api/agent/labels', {
      method: 'POST',
      body: JSON.stringify({ keywords, n_posts, contexto }),
    }),
});

// ============== SYSTEM endpoints ==============
export interface SystemPipelineResponse {
  ts: string;
  pull_state: { total_entries: number; data: any[]; most_stale: any[] };
  crons: Record<string, { last_run: string | null; log_path?: string; last_log_lines: string[] }>;
  webhooks: { total_events: number; last_10: any[]; log_size_bytes: number };
  news_rate: { last_24h?: number; error?: string };
}
Object.assign(radarAPI, {
  systemPipeline: () => request<SystemPipelineResponse>('/api/system/pipeline'),
});

// ============== POSTS endpoints ==============
export interface Post {
  ator_id: string; plataforma: string; post_id: string;
  data_dt: string | null; tipo: string | null;
  texto: string | null; link: string | null; imagem: string | null;
  likes: number | null; comments: number | null; shares: number | null;
  interactions: number | null; interaction_rate: number | null;
  sentiment_pos_share: number | null; sentiment_neg_share: number | null;
  is_reel_or_short: number | null; video_views: number | null;
}
export interface PostsListResponse {
  total: number; limit: number; offset: number; sort: string;
  data: Post[];
}
export interface PostsStatsResponse {
  period: string; total: number;
  per_plataforma: Array<{ plataforma: string; n: number; interactions_total: number; interactions_mean: number }>;
  top_atores: Array<{ ator_id: string; n: number; interactions_total: number }>;
}
Object.assign(radarAPI, {
  posts: (params: { ator_id?: string; plataforma?: string; tipo?: string; q?: string; period?: string; min_interactions?: number; sort?: string; limit?: number; offset?: number } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k,v]) => v!==undefined && qs.set(k, String(v)));
    return request<PostsListResponse>(`/api/posts${qs.toString() ? '?'+qs : ''}`);
  },
  postsStats: (period: string = '30d') =>
    request<PostsStatsResponse>(`/api/posts/stats?period=${period}`),
});
