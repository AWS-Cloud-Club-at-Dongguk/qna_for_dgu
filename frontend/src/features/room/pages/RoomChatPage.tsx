import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useChatRoomReadMode } from '@/context/ChatModeContext'
import MessageCard from '@/features/room/components/MessageCard'
import ChatInput from '@/features/room/components/ChatInput'
import NewMessageCard from '@/features/room/components/NewMessageCard'
import { ChatMessageData } from '@/features/room/types'

const RoomChatPage = () => {
    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const [nickname, setNickname] = useState('')
    const [unreadMessage, setUnreadMessage] = useState<ChatMessageData | null>(null)
    const [like, setLike] = useState<{ [key: string]: boolean }>({})
    const { isReadMode } = useChatRoomReadMode()
    const scrollRef = useRef<HTMLDivElement>(null)

    const [searchParams, setSearchParams] = useSearchParams();
    const roomId = searchParams.get('roomId') || '';

    const SCROLL_THRESHOLD = 50 // 스크롤이 이 거리보다 가까우면 자동 스크롤

    const scrollToBottom = () => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        })
        setUnreadMessage(null)
    }

    // 스크롤이 바닥에 가까운지 확인하는 함수
    const isNearBottom = () => {
        const el = scrollRef.current
        if (!el) return true
        const distanceToBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight
        return distanceToBottom < SCROLL_THRESHOLD
    }

    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
        if (isNearBottom()) {
            setUnreadMessage(null)
        }
    }

    // 초기 메시지 로드 및 스크롤 위치 조정
    const sendMessage = (content: string) => {
        const newMsg = {
            id: Math.random().toString(),
            nickname,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
        }

        const shouldAutoScroll = isNearBottom()

        setMessages((prev) => [...prev, newMsg])

        setTimeout(() => {
            if (shouldAutoScroll) {
                scrollToBottom()
            } else {
                setUnreadMessage(newMsg)
            }
        }, 10)
    }

    const likeMessage = (id: string) => {
        const alreadyLiked = like[id] ?? false

        console.log(`Message ${id} liked: ${!alreadyLiked}`)

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === id
                    ? { ...msg, likes: msg.likes + (alreadyLiked ? -1 : 1) }
                    : msg
            )
        )

        setLike((prev) => ({
            ...prev,
            [id]: !alreadyLiked,
        }))
    }

    useEffect(() => {
        setMessages([
            {
                id: '1',
                nickname: '테스터1',
                isLiked: false,
                content: '첫 번째 메시지입니다.',
                createdAt: new Date().toISOString(),
                likes: 2,
            },
            {
                id: '2',
                nickname: '테스터2',
                isLiked: false,
                content: 'QnA 채팅방에 오신 걸 환영합니다!',
                createdAt: new Date().toISOString(),
                likes: 0,
            },
        ])

        setTimeout(scrollToBottom, 0)
    }, [])

    return (
        <div className="flex flex-col h-full w-full mx-auto relative px-2">
            {/* 메시지 리스트 */}
            <div className="flex-1 flex h-full flex-col overflow-hidden px-4 pt-4">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto space-y-3 pr-1 relative"
                >
                    {messages.map((msg) => (
                        <MessageCard
                            key={msg.id}
                            message={msg}
                            isLiked={like[msg.id] ?? false}
                            onLike={likeMessage}
                            isNew={false}
                        />
                    ))}
                </div>
            </div>
            {/* NewMessageCard는 메시지 스크롤 위에 겹치게 */}
            {unreadMessage && (
                <div
                    className={`absolute ${isReadMode ? 'bottom-0' : 'bottom-16'} left-1/2 -translate-x-1/2 z-30 w-full`}
                    onClick={scrollToBottom}
                >
                    <NewMessageCard message={unreadMessage} />
                </div>
            )}

            {/* 입력창은 고정 (겹치지 않게) */}
            {!isReadMode && (
                <div className="w-full bg-white px-4 pt-2 pb-3">
                    <ChatInput
                        nickname={nickname}
                        onNicknameChange={setNickname}
                        onSend={sendMessage}
                    />
                </div>
            )}
        </div>
    )
}

export default RoomChatPage
