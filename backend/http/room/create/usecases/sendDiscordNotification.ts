import { sendDiscordMsg } from "@/common/utils/sendDiscordMsg";

export const sendDiscordNotification = async (title: string, qrCodeUrl: string): Promise<void> => {
    // 6. discord webhook에 전송
    await sendDiscordMsg(title, qrCodeUrl);
}