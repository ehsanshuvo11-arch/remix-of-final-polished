import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  normalizePortfolioProjectRow,
  normalizeProcessStepRow,
  normalizeServiceRow,
  normalizeStatRow,
} from '@/lib/content-schema';
import type { Service, PortfolioProject, ProcessStep, Stat, Transformation, UILabelsContent } from '@/types/database';

export function useUILabels() {
  return useSiteSetting<UILabelsContent>('ui_labels');
}

/**
 * All site settings are fetched in ONE request and cached, instead of one
 * network round-trip per key (which was ~20 requests on first paint).
 */
function useAllSiteSettings() {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('key,value');
      if (error) throw error;
      const map: Record<string, unknown> = {};
      for (const row of data ?? []) map[(row as { key: string }).key] = (row as { value: unknown }).value;
      return map;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useSiteSetting<T = Record<string, any>>(key: string) {
  const query = useAllSiteSettings();
  return {
    ...query,
    data: (query.data?.[key] as T | undefined) ?? null,
  };
}


export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []).map((row) => normalizeServiceRow(row as Record<string, unknown>)) as Service[];
    },
    staleTime: 30000,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []).map((row) => normalizePortfolioProjectRow(row as Record<string, unknown>)) as PortfolioProject[];
    },
    staleTime: 30000,
  });
}

export function useProcessSteps() {
  return useQuery({
    queryKey: ['process-steps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_steps')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []).map((row) => normalizeProcessStepRow(row as Record<string, unknown>)) as ProcessStep[];
    },
    staleTime: 30000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []).map((row) => normalizeStatRow(row as Record<string, unknown>)) as Stat[];
    },
    staleTime: 30000,
  });
}

export function useTransformations() {
  return useQuery({
    queryKey: ['transformations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true, nullsFirst: false });
      if (error) {
        // Table may not exist yet — fail silently so the section just hides.
        if ((error as { code?: string }).code === '42P01') return [] as Transformation[];
        throw error;
      }
      return (data ?? []) as Transformation[];
    },
    staleTime: 30000,
  });
}
