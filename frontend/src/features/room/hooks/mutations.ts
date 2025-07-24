// mutations 모음
import { useMutation, useQueryClient } from '@tanstack/react-query'
import httpClient from '@/shared/services/httpClient'
import { ChatRoomInfoDto } from '@/features/room/types'

/** 1. 질문방 생성 */
export const useCreateChatRoom = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<ChatRoomInfoDto, 'id'>) =>
            httpClient.post('rooms', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatRoom'] }) // 목록 뷰가 있다면 여기서
        },
    })
}

/** 2. 질문방 정보 수정 */
export const useUpdateChatRoomInfo = (roomId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<Omit<ChatRoomInfoDto, 'id'>>) =>
            httpClient.put(`rooms/${roomId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatRoom', roomId] })
        },
    })
}

/** 3. 질문방 삭제 */
export const useDeleteChatRoom = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (roomId: string) => httpClient.delete(`rooms/${roomId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chatRoom'] }) // 목록 뷰가 있다면 여기서
        },
    })
}
