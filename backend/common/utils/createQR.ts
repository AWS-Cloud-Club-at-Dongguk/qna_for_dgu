import QRCode from "qrcode";

/**
 * Generates a QR code from the given text.
 * @param {string} text - The text to encode in the QR code.
 * @returns {Promise<string>} - A promise that resolves to the base64 string of the QR code image.
 */

export const generateQrCode = async (text: string): Promise<string> => {
    try {
        return await QRCode.toDataURL(text);
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : JSON.stringify(error);

        throw new Error("Failed [Util] in [generateQR] util : " + message);
    }
}