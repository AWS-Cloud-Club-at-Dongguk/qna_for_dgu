/** for api */
export interface ChatRoomInfoDto {
    id: string
    title: string
    description?: string
    bannerUrl?: string
    iconUrl?: string
}

export interface ChatMessageDto {
    messageId: string,
    nickname: string
    content: string
    timestamp: string
    likes: number
}

export interface RequestChatMessageDto {
    clientId: string
    nickname: string
    content: string
}

export type ChatMessageListDto = {
    messages: ChatMessageDto[]
}

/** use only client side */
export type ChatMessageData = ChatMessageDto & {
    isLiked: boolean
}

export type ChatRoomInfoData = ChatRoomInfoDto

export type ChatMessageListData = ChatMessageData[]

export type ChatRoomData = ChatRoomInfoData & {
    messages: ChatMessageListData
}
