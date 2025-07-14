import { sendDiscordMsg } from "@/common/utils/sendDiscordMsg";

export const sendDiscordNotification = async (title: string, qrCodeUrl: string): Promise<void> => {
    // 6. discord webhook에 전송
    try {
        await sendDiscordMsg(title, qrCodeUrl);
    } catch (error) {
        // console.error("Discord notification error:", error);
        throw new Error("Failed to send Discord notification: " + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
}