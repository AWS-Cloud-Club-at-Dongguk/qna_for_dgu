import { useChatRoomReadMode } from '@/context/ChatModeContext'
import { useChatQuestionCount } from '@/context/ChatQuestionCountContext'
import { useTopNav } from '@/context/TopNavContext'

const TopNav = () => {
    const { isReadMode, setIsReadMode } = useChatRoomReadMode()
    const { title, description, bannerUrl, iconUrl } = useTopNav()
    const { questionCount } = useChatQuestionCount()

    return (
        <div className="w-full bg-white-soft">
            {/* 배너 이미지 (선택) */}
            {bannerUrl && (
                <div className="relative w-full overflow-hidden">
                    <div className="pt-[25%]" /> {/* 4:1 비율 유지 */}
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${bannerUrl})` }}
                    />
                </div>
            )}

            {/* 상단 바 내용 */}
            <div className="w-full mx-auto px-4 py-4 flex gap-4 items-start">
                {/* 대표 이미지 */}
                <img
                    src={iconUrl}
                    alt="icon"
                    className="w-12 h-12 rounded-md object-cover"
                />

                {/* title, description 영역 */}
                <div className="flex-1">
                    <h1 className="text-xl font-semibold text-black-soft">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted mt-1">{description}</p>
                    )}
                </div>

                {/* 질문 개수 텍스트 */}
                <div className="flex text-md text-black-soft font-medium gap-2 mr-2 whitespace-nowrap">
                    <div className="text-xl">{questionCount}</div> questions
                </div>

                {/* 토글 버튼 */}
                <button
                    onClick={() => setIsReadMode(!isReadMode)}
                    className={`relative w-20 h-8 rounded-full flex items-center px-1 transition-colors duration-300 ${isReadMode ? 'bg-success' : 'bg-warning'}`}
                >
                    {/* 텍스트 */}
                    <span
                        className={`absolute left-2 text-xs font-semibold text-white transition-opacity duration-200 ${isReadMode ? 'opacity-100' : 'opacity-0'}`}
                    >
                        READ
                    </span>
                    <span
                        className={`absolute right-2 text-xs font-semibold text-white transition-opacity duration-200 ${isReadMode ? 'opacity-0' : 'opacity-100'}`}
                    >
                        WRITE
                    </span>

                    {/* 똑딱이 버튼: 타원형 */}
                    <span
                        className={`w-7 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${isReadMode ? 'translate-x-[2.75rem]' : 'translate-x-0'}`}
                    />
                </button>
            </div>
        </div>
    )
}

export default TopNav
