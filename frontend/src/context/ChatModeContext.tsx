import { createContext, useContext, useState } from 'react'
import * as React from 'react'

// 타입 정의
type ChatRoomReadModeContextType = {
    isReadMode: boolean
    setIsReadMode: (value: boolean) => void
}

// 기본값 없이 undefined → 실수 방지
const ChatRoomReadModeContext = createContext<
    ChatRoomReadModeContextType | undefined
>(undefined)

// Provider 컴포넌트
export function ChatRoomReadModeProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [isReadMode, setIsReadMode] = useState(false) // 기본값은 쓰기 모드

    return (
        <ChatRoomReadModeContext.Provider value={{ isReadMode, setIsReadMode }}>
            {children}
        </ChatRoomReadModeContext.Provider>
    )
}

// 커스텀 훅 (반드시 Provider 내부에서만 사용 가능)
export const useChatRoomReadMode = () => {
    const context = useContext(ChatRoomReadModeContext)
    if (!context) {
        throw new Error(
            'useChatRoomReadMode는 반드시 ChatRoomReadModeProvider 안에서 사용해야 합니다.'
        )
    }
    return context
}
