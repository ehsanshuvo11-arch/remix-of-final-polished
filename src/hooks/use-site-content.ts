import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  normalizePortfolioProjectRow,
  normalizeProcessStepRow,
  normalizeServiceRow,
  normalizeStatRow,
} from '@/lib/content-schema';
import type { Service, PortfolioProject, ProcessStep, Stat, Transformation } from '@/types/database';

export function useSiteSetting<T = Record<string, any>>(key: string) {
  return useQuery({
    queryKey: ['site-setting', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      if (error) throw error;
      return (data?.value as T) ?? null;
    },
    staleTime: 30000,
  });
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
