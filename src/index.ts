import {LocalAuth} from "whatsapp-web.js";

const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

// ChatGPT & DALLE
import { handleMessageGPT } from './gpt'
import { handleMessageDALLE } from './dalle'

// Environment variables
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Prefixes
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
const gptPrefix = '!gpt'
const dallePrefix = '!dalle'

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    }
})

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
    client.on("message", async (message: any) => {
        const messageString = message.body
        if (messageString.length == 0) return
        if (message.from == "status@broadcast") return

        if (prefixEnabled) {
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
        } else {
            // GPT (only <prompt>)
            await handleMessageGPT(message, messageString)
        }
    })

    // Whatsapp initialization
    client.initialize()
}

start()
