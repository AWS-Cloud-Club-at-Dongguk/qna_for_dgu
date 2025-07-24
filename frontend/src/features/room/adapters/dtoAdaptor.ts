import {
    ChatMessageData,
    ChatMessageDto,
    ChatMessageListData,
    ChatRoomInfoData,
    ChatRoomInfoDto,
} from '@/features/room/types'

// const liked = getLikedMessageIds() // localStorage에서 가져오기
export const toChatMessageData = (dto: ChatMessageDto): ChatMessageData => {
    return {
        ...dto,
        isLiked: false, // 초기값은 false로 설정
    }
}

// createdAt 기준으로 정렬된 메시지 리스트를 반환
export const toChatMessageListData = (
    messages: ChatMessageDto[]
): ChatMessageListData => {
    return messages
        .sort(
            (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
        )
        .map(toChatMessageData)
}

export const toChatRoomInfoData = (dto: ChatRoomInfoDto): ChatRoomInfoData => {
    return {
        ...dto,
    }
}
