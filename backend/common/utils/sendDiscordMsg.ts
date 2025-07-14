import { Webhook, MessageBuilder } from 'discord-webhook-node';
import { InternalServerError } from "@/common/errors/InternalServerError";

/**
 * Utility function to send messages to a Discord channel.
 * Uses the Discord Webhook API for sending messages.
 */

export const sendDiscordMsg = async (roomName: string, qrCodeImgUrl: string) => {
    const webhookUrl = process.env.DISCORD_QNA_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new InternalServerError("Discord webhook URL is not defined in environment variables.");
    }

    const hook = new Webhook(webhookUrl);
    const embed = new MessageBuilder()
        .setTitle("🎉 Today's QnA Room is ready to go!")
        .setAuthor("ACC DGU")
        .setDescription(`Room Title : ${roomName} \n\n ⌛ This room will automatically close in 2 hours. Join while it lasts!`)
        .setImage(qrCodeImgUrl) // 또는 CDN URL
        .setColor(0x00FF00)
        .setTimestamp();

    try {
        await hook.send(embed);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : JSON.stringify(error);

        throw new InternalServerError("Failed [Util] in [sendDiscordMsg] util : " + message);
    }
}