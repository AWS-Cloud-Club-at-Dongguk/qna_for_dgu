import { useEffect, useRef, useState } from 'react'
import wsClient from '@/shared/services/wsClient'
import { RequestChatMessageDto, ChatMessageData } from '@/features/room/types'

export const useChatSocket = (roomId: string, clientId: string) => {
    const [messages, setMessages] = useState<ChatMessageData[]>([])
    const socketRef = useRef<WebSocket>()

    useEffect(() => {
        const socket = wsClient.connect(
            'room',
            { roomId, clientId },
            (event) => {
                const data = JSON.parse(event.data)
                if (data.type === 'message') {
                    setMessages((prev) => [
                        ...prev,
                        { ...data.payload, isLiked: false },
                    ])
                }
            }
        )
        socketRef.current = socket

        return () => {
            wsClient.close(socket)
        }
    }, [roomId, clientId])

    const sendMessage = (msg: RequestChatMessageDto) => {
        if (socketRef.current) {
            socketRef.current.send(
                JSON.stringify({
                    action: 'sendmessage',
                    roomId,
                    data: msg,
                })
            )
        }
    }

    return { messages, sendMessage }
}
