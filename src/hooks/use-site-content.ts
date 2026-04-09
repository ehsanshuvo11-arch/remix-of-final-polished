import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Service, PortfolioProject, ProcessStep, Stat } from '@/types/database';

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
      return data as Service[];
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
      return data as PortfolioProject[];
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
      return data as ProcessStep[];
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
      return data as Stat[];
    },
    staleTime: 30000,
  });
}
