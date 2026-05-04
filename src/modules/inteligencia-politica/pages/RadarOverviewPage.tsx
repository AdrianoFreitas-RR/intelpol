/**
 * RadarOverviewPage — Tela 1 prototype mínimo conectado à API.
 * Versão V0 do MVP — KPIs + ranking simples. Refinamento visual virá com Tremor cards + ECharts.
 */
import { useOverview, useHealth } from "../hooks/useRadar";

const fmt = (n: number | null | undefined): string => {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
};

const fmtBRL = (n: number | null | undefined): string => {
  if (n == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
};

const blocoColors: Record<string, string> = {
  bolsonarista: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  centro: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  independente: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  esquerda: "bg-rose-500/20 text-rose-300 border-rose-500/40",
};

export default function RadarOverviewPage() {
  const health = useHealth();
  const { data, isLoading, error } = useOverview("30d");

  if (isLoading) {
    return (
      <div className="p-8 text-zinc-400">Carregando inteligência política RR...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-rose-400">
        Erro ao carregar API:{" "}
        {error instanceof Error ? error.message : "desconhecido"}
        <br />
        <span className="text-zinc-500 text-sm">
          Verifique se a API está rodando em http://10.10.1.22:3334/api/health
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-10">
      <header className="mb-8">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Radar IP-RR
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Inteligência Política Digital · Roraima · Janela {data.period}
            </p>
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {health.data?.status === "ok" ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                API v{health.data.version} · {health.data.row_counts.posts} posts ·{" "}
                {health.data.row_counts.ads} ads · {health.data.row_counts.tse_candidatos}{" "}
                candidatos TSE
              </span>
            ) : (
              <span>API offline</span>
            )}
          </div>
        </div>
      </header>

      {/* KPI Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Atores", value: data.kpis.atores, color: "text-zinc-100" },
          { label: "Alcance total", value: fmt(data.kpis.alcance_total), color: "text-sky-300" },
          { label: "Paid R$ 12m", value: fmtBRL(data.kpis.paid_total), color: "text-emerald-300" },
          { label: "Ads na janela", value: fmt(data.kpis.ads_janela), color: "text-amber-300" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              {kpi.label}
            </div>
            <div className={`text-3xl font-bold mt-2 ${kpi.color}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </section>

      {/* Ranking */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-zinc-200">
          Ranking por seguidores (FB+IG)
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50 border-b border-zinc-800">
              <tr className="text-left text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Ator</th>
                <th className="px-4 py-3 font-medium">Partido</th>
                <th className="px-4 py-3 font-medium">Bloco</th>
                <th className="px-4 py-3 font-medium text-right">Seguidores</th>
                <th className="px-4 py-3 font-medium text-right">Paid R$</th>
                <th className="px-4 py-3 font-medium text-right">Ads</th>
              </tr>
            </thead>
            <tbody>
              {data.ranking.map((r, i) => (
                <tr
                  key={r.ator_id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-zinc-500 font-mono">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-zinc-100">{r.nome_curto}</td>
                  <td className="px-4 py-3 text-zinc-300 font-mono text-xs">
                    {r.partido_atual ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.bloco_ideologico ? (
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                          blocoColors[r.bloco_ideologico] ??
                          "bg-zinc-700/40 text-zinc-300 border-zinc-600"
                        }`}
                      >
                        {r.bloco_ideologico}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sky-300 font-mono">
                    {fmt(r.followers)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-300 font-mono">
                    {fmtBRL(r.paid_total)}
                  </td>
                  <td className="px-4 py-3 text-right text-amber-300 font-mono">
                    {fmt(r.ads_count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-12 text-center text-xs text-zinc-600">
        Radar IP-RR v0.7 · MVP em construção · Backend agserver:3334
      </footer>
    </div>
  );
}
