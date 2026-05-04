/**
 * Hooks TanStack Query para o módulo Radar IP-RR.
 * Cada endpoint da API tem seu hook com cache padronizado.
 */
import { useQuery } from "@tanstack/react-query";
import { radarAPI } from "../api/client";

const STALE = {
  short: 1000 * 60 * 5,    // 5min — KPIs voláteis
  medium: 1000 * 60 * 15,  // 15min — análises
  long: 1000 * 60 * 60,    // 1h — atores, cross-cycle
};

export function useHealth() {
  return useQuery({
    queryKey: ["radar", "health"],
    queryFn: () => radarAPI.health(),
    staleTime: 0, // sempre fresco
    refetchOnWindowFocus: true,
  });
}

export function useAtores(prioridade?: "alta" | "baixa") {
  return useQuery({
    queryKey: ["radar", "atores", prioridade],
    queryFn: () => radarAPI.atores(prioridade),
    staleTime: STALE.long,
  });
}

export function useAtor(atorId: string | null) {
  return useQuery({
    queryKey: ["radar", "ator", atorId],
    queryFn: () => radarAPI.ator(atorId!),
    enabled: !!atorId,
    staleTime: STALE.long,
  });
}

export function useOverview(period: string = "30d") {
  return useQuery({
    queryKey: ["radar", "overview", period],
    queryFn: () => radarAPI.overview(period),
    staleTime: STALE.short,
  });
}

export function useDrilldown(atorId: string | null, period: string = "60d") {
  return useQuery({
    queryKey: ["radar", "drilldown", atorId, period],
    queryFn: () => radarAPI.drilldown(atorId!, period),
    enabled: !!atorId,
    staleTime: STALE.short,
  });
}

export function usePaid(period: string = "30d") {
  return useQuery({
    queryKey: ["radar", "paid", period],
    queryFn: () => radarAPI.paid(period),
    staleTime: STALE.short,
  });
}

export function useAnomalies(period: string = "90d", severity?: string) {
  return useQuery({
    queryKey: ["radar", "anomalies", period, severity],
    queryFn: () => radarAPI.anomalies(period, severity),
    staleTime: STALE.short,
  });
}

export function useIturassu() {
  return useQuery({
    queryKey: ["radar", "ituassu"],
    queryFn: () => radarAPI.ituassu(),
    staleTime: STALE.medium,
  });
}

export function useCrossCycle(anoMin: number = 2014, anoMax: number = 2026) {
  return useQuery({
    queryKey: ["radar", "cross-cycle", anoMin, anoMax],
    queryFn: () => radarAPI.crossCycle(anoMin, anoMax),
    staleTime: STALE.long,
  });
}

export function useFraming(minPosts: number = 20) {
  return useQuery({
    queryKey: ["radar", "framing", minPosts],
    queryFn: () => radarAPI.framing(minPosts),
    staleTime: STALE.medium,
  });
}
