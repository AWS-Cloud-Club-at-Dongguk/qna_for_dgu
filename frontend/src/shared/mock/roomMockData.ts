import { ChatMessageListData, ChatMessageListDto, ChatRoomData, ChatRoomInfoDto } from "@/features/room/types";

export const mockChatRoomInfoDto: ChatRoomInfoDto = {
  id: 'room-1',
  title: '익명 질문방',
  description: '자유롭게 질문을 남겨보세요',
  bannerUrl: 'https://example.com/banner.png',
  iconUrl: 'https://example.com/icon.png',
}

export const mockChatMessageListDto: ChatMessageListDto = {
  messages: [
    {
      id: 'msg-1',
      nickname: '익명1',
      content: '이 프로젝트의 목적이 뭔가요?',
      createdAt: new Date().toISOString(),
      likes: 3,
    },
    {
      id: 'msg-2',
      nickname: '익명2',
      content: '질문에 좋아요 누르면 정렬되나요?',
      createdAt: new Date().toISOString(),
      likes: 5,
    },
  ],
}

export const mockChatMessageListData: ChatMessageListData = mockChatMessageListDto.messages.map((msg, index) => ({
  ...msg,
  isLiked: index % 2 === 0, // 임의로 짝수 index만 liked 처리
}))

export const mockChatRoomData: ChatRoomData = {
  ...mockChatRoomInfoDto,
  messages: mockChatMessageListData,
}