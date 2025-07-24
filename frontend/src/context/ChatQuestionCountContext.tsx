import { createContext, useContext, useState } from 'react'

type ChatQuestionCountContextType = {
    questionCount: number
    setQuestionCount: (count: number) => void
}

export const ChatQuestionCountContext = createContext<
    ChatQuestionCountContextType | undefined
>(undefined)

export function ChatQuestionCountProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [questionCount, setQuestionCount] = useState<number>(0)

    return (
        <ChatQuestionCountContext.Provider
            value={{ questionCount, setQuestionCount }}
        >
            {children}
        </ChatQuestionCountContext.Provider>
    )
}

export const useChatQuestionCount = () => {
    const context = useContext(ChatQuestionCountContext)
    if (!context) {
        throw new Error(
            'useChatQuestionCount must be used within a ChatQuestionCountProvider'
        )
    }
    return context
}
