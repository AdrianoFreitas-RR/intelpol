/**
 * Hooks TanStack Query para o módulo Radar IP-RR.
 * Cada endpoint da API tem seu hook com cache padronizado.
 */
import { useQuery } from "@tanstack/react-query";
import { radarAPI, RadarAPIError } from "../api/client";

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

// ============== NEWS hooks ==============
import type { NewsListResponse, NewsStatsResponse, AgentDiagnoseResponse, AgentChatMessage, AgentChatResponse, AgentLabelsResponse } from '../api/client';

export function useNews(params: { ator_id?: string; tema?: string; fonte?: string; period?: string; limit?: number; offset?: number } = {}) {
  return useQuery<NewsListResponse, RadarAPIError>({
    queryKey: ['news', params],
    queryFn: () => (radarAPI as any).news(params),
    staleTime: STALE.short,
  });
}

export function useNewsStats(period: string = '30d') {
  return useQuery<NewsStatsResponse, RadarAPIError>({
    queryKey: ['news', 'stats', period],
    queryFn: () => (radarAPI as any).newsStats(period),
    staleTime: STALE.medium,
  });
}

// ============== AGENT hooks (mutations) ==============
import { useMutation } from '@tanstack/react-query';

export function useAgentDiagnose() {
  return useMutation<AgentDiagnoseResponse, RadarAPIError, { ator_id: string; period?: string; contexto_extra?: string }>({
    mutationFn: ({ ator_id, period='30d', contexto_extra }) => (radarAPI as any).agentDiagnose(ator_id, period, contexto_extra),
  });
}

export function useAgentChat() {
  return useMutation<AgentChatResponse, RadarAPIError, { messages: AgentChatMessage[]; contexto_ator_id?: string }>({
    mutationFn: ({ messages, contexto_ator_id }) => (radarAPI as any).agentChat(messages, contexto_ator_id),
  });
}

export function useAgentLabels() {
  return useMutation<AgentLabelsResponse, RadarAPIError, { keywords: string[]; n_posts?: number; contexto?: string }>({
    mutationFn: ({ keywords, n_posts, contexto }) => (radarAPI as any).agentLabels(keywords, n_posts, contexto),
  });
}

import type { SystemPipelineResponse } from '../api/client';
export function useSystemPipeline() {
  return useQuery<SystemPipelineResponse, RadarAPIError>({
    queryKey: ['system','pipeline'],
    queryFn: () => (radarAPI as any).systemPipeline(),
    staleTime: STALE.short,
    refetchInterval: 30_000,
  });
}

import type { PostsListResponse, PostsStatsResponse } from '../api/client';
export function usePosts(params: { ator_id?: string; plataforma?: string; tipo?: string; q?: string; period?: string; min_interactions?: number; sort?: string; limit?: number; offset?: number } = {}) {
  return useQuery<PostsListResponse, RadarAPIError>({
    queryKey: ['posts', params],
    queryFn: () => (radarAPI as any).posts(params),
    staleTime: STALE.short,
  });
}
export function usePostsStats(period: string = '30d') {
  return useQuery<PostsStatsResponse, RadarAPIError>({
    queryKey: ['posts','stats',period],
    queryFn: () => (radarAPI as any).postsStats(period),
    staleTime: STALE.medium,
  });
}

import type { TimeseriesResponse } from '../api/client';
export function useTimeseries(params: { ator_id: string; plataforma: string; metric: string; period?: string }, enabled: boolean = true) {
  return useQuery<TimeseriesResponse, RadarAPIError>({
    queryKey: ['ts', params],
    queryFn: () => (radarAPI as any).timeseries(params),
    staleTime: STALE.short,
    enabled,
  });
}
