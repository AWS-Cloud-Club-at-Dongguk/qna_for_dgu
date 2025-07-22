// test.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import httpClient from '@/shared/services/httpClient'

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, any>) => httpClient.post("/tests", data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tests"] }), // queryKey에 해당하는 데이터를 stale(오래됨) 상태로 표시
  });
};