// query 모음
import { useQuery } from '@tanstack/react-query'
import httpClient from '@/shared/services/httpClient'
import {
    ChatRoomInfoDto,
    ChatMessageDto,
} from '@/features/room/types'
import {
    toChatMessageListData,
    toChatRoomInfoData,
} from '@/features/room/adapters/dtoAdaptor'

/** Rooms */
/** 1. Room info 조회 */
export const useChatRoomList = () => {
    return useQuery<ChatRoomInfoDto>({
        queryKey: ['chatRooms'],
        queryFn: () => httpClient.get('rooms'),
        select: (dto) => toChatRoomInfoData(dto),
        staleTime: 1000 * 30, // 30초 간 fresh
    })
}

/** 2. 질문방 메시지 조회 */
export const useChatRoomInfo = (roomId: string) => {
    return useQuery({
        queryKey: ['chatMessages', roomId],
        queryFn: () =>
            httpClient.get<ChatMessageDto[]>(`rooms/${roomId}/messages`),
        select: toChatMessageListData,
    })
}
