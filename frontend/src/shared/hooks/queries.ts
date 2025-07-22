// test.ts
import { useQuery } from '@tanstack/react-query'
import httpClient from '@/shared/services/httpClient'

export const GetTestMethod = () =>
    useQuery({
        queryKey: ['tests'],
        queryFn: () => httpClient.get('/tests'),
        staleTime: 1000 * 10, // 10초 동안 데이터가 신선하다고 간주
        refetchOnWindowFocus: false, // 탭 다시 눌러도 자동 호출 X
    })
