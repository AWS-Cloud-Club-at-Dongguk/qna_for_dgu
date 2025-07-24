import { createContext, useContext, useState } from 'react'

type TopNavContextType = {
    title: string
    setTitle: (title: string) => void
    description: string
    setDescription: (description: string) => void
    bannerUrl?: string
    setBannerUrl: (url: string) => void
    iconUrl: string
    setIconUrl: (url: string) => void
}

export const TopNavContext = createContext<TopNavContextType | undefined>(
    undefined
)

export function TopNavProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState<string>(
        '이것은 제ㅇㅈ머아ㅗ마너오jsailfjsailfjsaifjsaㅗ아너오목'
    )
    const [description, setDescription] = useState<string>(
        '이것은 설명ㅇ놈어ㅏㄴ모아ㅓㄴ모어ㅏㅁ노어ㅏㄴ모어ㅏㄴ모어ㅏㄴㅁ오ㅓㅏㄴ와너ㅗ어ㅏㄴ모어ㅏㅁ노안머ㅗ입니다요'
    )
    const [bannerUrl, setBannerUrl] = useState<string>('logo_awscloudclub.svg')
    const [iconUrl, setIconUrl] = useState<string>('logo_awscloudclub.svg')

    return (
        <TopNavContext.Provider
            value={{
                title,
                setTitle,
                description,
                setDescription,
                bannerUrl,
                setBannerUrl,
                iconUrl,
                setIconUrl,
            }}
        >
            {children}
        </TopNavContext.Provider>
    )
}

export const useTopNav = () => {
    const context = useContext(TopNavContext)
    if (!context) {
        throw new Error('useTopNav must be used within a TopNavProvider')
    }
    return context
}
