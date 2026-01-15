import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment } from '@/api/api'
import type { Assignment } from '@/types'

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  })
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignments', id],
    queryFn: () => getAssignment(id),
    enabled: !!id,
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Assignment, 'id' | 'totalSubmissions'>) => createAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Assignment, 'id'>> }) =>
      updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    },
  })
}
