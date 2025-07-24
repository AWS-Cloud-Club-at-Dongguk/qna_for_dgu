import formatTime from '@/shared/utils/formatTime'
import { ChatMessageData } from '@/features/room/types'

function NewMessageCard({ message }: { message: ChatMessageData }) {
    return (
        <div className="w-full mx-auto bg-white/50 backdrop-blur-md p-6 cursor-pointer transition hover:bg-white/100">
            <div className="absolute -top-4 left-5 flex items-center gap-1 bg-primary text-white-soft text-sm font-bold px-2 py-1 rounded-full">
                NEW
            </div>
            <div className="flex flex-col gap-2 opacity-80 hover:opacity-100 transition">
                <div className="flex items-center space-x-2">
                    <span className="text-sm sm:text-base font-semibold text-muted">
                        {message.nickname}
                    </span>
                    <span className="text-xs sm:text-sm text-muted">
                        {formatTime(message.timestamp)}
                    </span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-black-soft whitespace-pre-wrap break-words">
                    {message.content}
                </div>
            </div>
        </div>
    )
}

export default NewMessageCard
