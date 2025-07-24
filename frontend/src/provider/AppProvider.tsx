import { ChatRoomReadModeProvider } from '@/context/ChatModeContext'
import { ChatQuestionCountProvider } from '@/context/ChatQuestionCountContext'
import { TopNavProvider } from '@/context/TopNavContext'

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <TopNavProvider>
            <ChatQuestionCountProvider>
                <ChatRoomReadModeProvider>{children}</ChatRoomReadModeProvider>
            </ChatQuestionCountProvider>
        </TopNavProvider>
    )
}
