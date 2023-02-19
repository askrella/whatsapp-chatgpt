import process from "process";
import qrcode from "qrcode-terminal"

import { type Message } from "whatsapp-web.js";

import { handleMessageGPT } from "./gpt";
import { handleMessageDALLE } from "./dalle";

const prefixDisabled = process.env.PREFIX_ENABLED !== "true"
const gptPrefix = '!gpt'
const dallePrefix = '!dalle'

export const onQRCode = (qrCode: string) => {
    console.log("[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:")
    qrcode.generate(qrCode, { small: true }, null);
}

export const onAuthenticated = () => {
    console.log("[Whatsapp ChatGPT] Client authenticated");
}

export const onReady = () => {
    console.log("[Whatsapp ChatGPT] Client is ready!");
}

export const onMessage = async (message: Message) => {
    if (message.from.match(/status\@broadcast/ig)) return

    const messageString = message.body;
    if (messageString.length == 0) return

    console.log("[Whatsapp ChatGPT] Received message from " + message.from + ": " + messageString)

    if (prefixDisabled) {
        await handleMessageGPT(message, messageString)
        return
    }

    // GPT (!gpt <prompt>)
    if (messageString.startsWith(gptPrefix)) {
        const prompt = messageString.substring(gptPrefix.length + 1);
        await handleMessageGPT(message, prompt)
        return
    }

            // DALLE (!dalle <prompt>)
    if (messageString.startsWith(dallePrefix)) {
        const prompt = messageString.substring(dallePrefix.length + 1);
        await handleMessageDALLE(message, prompt)
        return
    }
}