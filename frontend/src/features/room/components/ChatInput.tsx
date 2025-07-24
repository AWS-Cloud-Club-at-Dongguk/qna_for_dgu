import { useState, useRef, useEffect } from 'react'
import RightPlaneIcon from '@/assets/icons/right_plane.svg?react'

function ChatInput({
    nickname,
    onNicknameChange,
    onSend,
}: {
    nickname: string
    onNicknameChange: (val: string) => void
    onSend: (content: string) => void
}) {
    const [content, setContent] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = () => {
        const trimmed = content.trim()
        if (!trimmed) return
        onSend(trimmed) // 외부 전달
        setContent('') // 내부 리셋
    }

    /**
     *
     * @param e 키보드 이벤트
     * @description Enter 키를 눌렀을 때 메시지를 전송합니다.
     * 필요하면 사용하기~!
     * @returns
     */
    /**
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing) return // 한글 조합 중

        const isSubmitKey =
            e.key === 'Enter' &&
            !e.shiftKey &&
            !e.metaKey &&
            !e.ctrlKey &&
            !e.altKey

        if (isSubmitKey) {
            e.preventDefault() // 전송 방지
            handleSend()
        }
    }
    */

    useEffect(() => {
        const el = textareaRef.current
        if (el) {
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
        }
    }, [content])

    return (
        <div className="flex gap-2 items-end">
            <div className="relative flex-3 group h-11 items-end">
                <input
                    value={nickname}
                    onChange={(e) => onNicknameChange(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full peer max-h-10 chat-input-field"
                />
                <span className="chat-input-field-b-line" />
            </div>

            <div className="relative flex-7 group h-11 items-end">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    // onKeyDown={handleKeyDown}
                    placeholder="Send a message..."
                    rows={1}
                    className="w-full max-h-10 resize-none peer chat-input-field"
                />
                <span className="chat-input-field-b-line" />
            </div>
            <button
                onClick={handleSend} //
                className="icon-button"
                disabled={!content.trim()}
            >
                <RightPlaneIcon
                    className="hover-size-up"
                    width={24}
                    height={24}
                />
            </button>
        </div>
    )
}

export default ChatInput
