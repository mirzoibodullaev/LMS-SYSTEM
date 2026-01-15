import { useQuery } from '@tanstack/react-query'
import { getDashboardStats, getRecentSubmissions } from '@/api/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  })
}

export function useRecentSubmissions(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recent-submissions', limit],
    queryFn: () => getRecentSubmissions(limit),
  })
}
