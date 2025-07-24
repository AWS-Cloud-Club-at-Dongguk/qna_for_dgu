import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useChatRoomReadMode } from '@/context/ChatModeContext'
import MessageCard from '@/features/room/components/MessageCard'
import ChatInput from '@/features/room/components/ChatInput'
import NewMessageCard from '@/features/room/components/NewMessageCard'
import { ChatMessageData, ChatMessageDto } from '@/features/room/types'
import wsClient from '@/shared/services/wsClient'
import httpClient from '@/shared/services/httpClient'

function RoomChatPage() {
    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const [nickname, setNickname] = useState('')
    const [unreadMessage, setUnreadMessage] = useState<ChatMessageData | null>(
        null
    )
    const [like, setLike] = useState<{ [key: string]: boolean }>({})
    const { isReadMode } = useChatRoomReadMode()
    const scrollRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<WebSocket | null>(null)

    const { roomId } = useParams<{ roomId: string }>()

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

    const sendMessage = (content: string) => {
        if (socketRef.current) {
            // 내 메시지 즉시 화면에 표시
            const myMsg = {
                messageId: Math.random().toString(), // Add a unique id
                nickname: 'Me',
                content,
                timestamp: new Date().toISOString(),
                likes: 0,
                isLiked: false, // Add the isLiked property
            }

            const shouldAutoScroll = isNearBottom()
            setMessages((prev) => [...prev, myMsg])

            setTimeout(() => {
                if (shouldAutoScroll) {
                    scrollToBottom()
                }
            }, 10)

            // WebSocket으로 다른 사용자들에게 전송
            wsClient.send(socketRef.current, {
                action: 'sendMessage',
                nickname: nickname || 'Anonymous',
                message: content,
                roomId,
            })
        }
    }

    /** 우선 사용 안 함 */
    const likeMessage = (id: string) => {
        const alreadyLiked = like[id] ?? false

        console.log(`Message ${id} liked: ${!alreadyLiked}`)

        setMessages((prev) =>
            prev.map((msg) =>
                msg.messageId === id
                    ? { ...msg, likes: msg.likes + (alreadyLiked ? -1 : 1) }
                    : msg
            )
        )

        setLike((prev) => ({
            ...prev,
            [id]: !alreadyLiked,
        }))
    }

    const handleWebSocketMessage = (event: MessageEvent) => {
        console.log('WebSocket message received:', event.data)

        try {
            const data = JSON.parse(event.data)
            if (data.type === 'message') {
                const newMsg = {
                    messageId: data.id,
                    nickname: data.nickname,
                    content: data.message,
                    timestamp: data.timestamp || new Date().toISOString(),
                    likes: 0,
                    isLiked: false, // Add the isLiked property
                }

                const shouldAutoScroll = isNearBottom()
                setMessages((prev) => {
                    return [...prev, newMsg]
                })

                setTimeout(() => {
                    if (shouldAutoScroll) {
                        scrollToBottom()
                    } else {
                        setUnreadMessage(newMsg)
                    }
                }, 10)
            }
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
        }
    }

    useEffect(() => {
        if (!roomId) return

        const loadMessages = async () => {
            try {
                const data = await httpClient.get<{
                    messages: ChatMessageDto[]
                }>(`rooms/${roomId}/messages`)

                const loadedMessages = data.messages.map((msg) => ({
                    messageId: msg.messageId,
                    nickname: msg.nickname ?? 'Anonymous',
                    content: msg.content,
                    timestamp: msg.timestamp,
                    likes: 0,
                    isLiked: false,
                }))

                setMessages(loadedMessages)
                setTimeout(scrollToBottom, 0)
            } catch (error) {
                console.error('메시지 로딩 실패:', error)
            }
        }

        loadMessages()

        const socket = wsClient.connect('', { roomId }, handleWebSocketMessage)
        socketRef.current = socket

        // WebSocket 연결 상태 확인
        if (socketRef.current) {
            socketRef.current.onopen = () => console.log('WebSocket connected')
            socketRef.current.onerror = (error) =>
                console.log('WebSocket error:', error)
            socketRef.current.onclose = () => console.log('WebSocket closed')
        }

        return () => {
            console.log('Cleaning up WebSocket connection')
            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN
            ) {
                wsClient.close(socketRef.current)
            }
            socketRef.current = null
        }
    }, [roomId])

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
                            key={msg.messageId}
                            message={msg}
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
