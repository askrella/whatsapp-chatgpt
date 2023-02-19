import qrcode from 'qrcode-terminal'
import { Client, Message } from "whatsapp-web.js";

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// ChatGPT & DALLE
import { handleMessageGPT } from './gpt'
import { handleMessageDALLE } from './dalle'
import { handleMessageCONFIG } from "./config/dalle-config";

// Prefixes
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
const shouldReplySelf = process.env.REPLY_SELF_ENABLED == "true"
const gptPrefix = '!gpt'
const dallePrefix = '!dalle'
const configPrefix = '!dalle'

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// sends message
async function sendMessage(message: Message) {
    const messageString = message.body

    if (messageString.length == 0) return;

    if (!prefixEnabled) {
        // GPT (only <prompt>)
        await handleMessageGPT(message, messageString);
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

    // Config (!dalle <prompt>)
    if (messageString.startsWith(configPrefix)) {
        const prompt = messageString.substring(configPrefix.length + 1);
        await handleMessageCONFIG(message, prompt)
        return
    }
}

// Entrypoint
const start = async () => {
    // Whatsapp auth
    client.on("qr", (qr: string) => {
        console.log("[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:")
        qrcode.generate(qr, { small: true });
    })

    // Whatsapp ready
    client.on("ready", () => {
        console.log("[Whatsapp ChatGPT] Client is ready!");
    })

    // Whatsapp message
    client.on("message", async (message: Message) => {
        if (message.from == "status@broadcast") return
        await sendMessage(message);
    })

    // reply to own message
    client.on("message_create", async (message: Message) => {
        if (message.fromMe && shouldReplySelf) {
            await sendMessage(message);
        }
    });

    // Whatsapp initialization
    client.initialize()
}

start()
