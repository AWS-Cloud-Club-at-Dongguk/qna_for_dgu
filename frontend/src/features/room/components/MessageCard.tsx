// import HeartIcon from '@/assets/icons/heart_empty.svg?react'
import DefaultProfileIcon from '@/assets/icons/default_profile.svg?react'
import linkifyText from '@/shared/utils/linkifyText'
import formatTime from '@/shared/utils/formatTime'
import { ChatMessageData } from '@/features/room/types'

type Props = {
    message: ChatMessageData
    onLike: (id: string) => void
    isNew: boolean
}

function MessageCard({ message, isNew }: Props) {
    const formattedTime = formatTime(message.timestamp)

    return (
        <div
            className={`flex items-start gap-2.5 transition-all duration-300 ${
                isNew ? 'animate-glow ring-2 ring-[--color-primary]/40' : ''
            }`}
        >
            <DefaultProfileIcon className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />

            <div className="flex flex-col w-full">
                <div className="flex flex-col w-full max-w-full leading-[1.6] p-3 sm:p-4 md:p-5 bg-gray-100 rounded-e-xl rounded-es-xl gap-2">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm sm:text-base font-semibold text-muted">
                            {message.nickname}
                        </span>
                        <span className="text-xs sm:text-sm text-muted">
                            {formattedTime}
                        </span>
                    </div>

                    <p className="text-lg sm:text-xl font-bold text-black-soft whitespace-pre-wrap break-words">
                        {linkifyText(message.content)}
                    </p>
                    {/*}
                    <button
                        type="button"
                        onClick={() => onLike(message.id)}
                        className="text-sm text-muted font-medium inline-flex items-center gap-1"
                    >
                        <HeartIcon
                            width={16}
                            height={16}
                            className={`transition ${message.isLiked && 'fill-muted'}`}
                        />
                        <span>{message.likes}</span>
                    </button>
                    */}
                </div>
            </div>
        </div>
    )
}

export default MessageCard
