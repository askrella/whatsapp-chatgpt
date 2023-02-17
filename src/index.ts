const process = require("process")
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
import { ChatGPTAPI, ChatMessage } from 'chatgpt'

// Environment variables
require("dotenv").config()

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
const prefix = '!gpt'

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    }
})

// ChatGPT Client
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
})

// Mapping from number to last conversation id
const conversations = {}

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
        if (message.body.length == 0) return
        if (message.from == "status@broadcast") return

        if (prefixEnabled) {
            if (message.body.startsWith(prefix)) {
                // Get the rest of the message
                const prompt = message.body.substring(prefix.length + 1);
                await handleMessage(message, prompt)
            }
        } else {
            await handleMessage(message, message.body)
        }
    })

    client.initialize()
}

const handleMessage = async (message: any, prompt: any) => {
    try {
        const lastConversation = conversations[message.from]

        // Add the message to the conversation
        console.log("[Whatsapp ChatGPT] Received prompt from " + message.from + ": " + prompt)
        let response: ChatMessage;

        const start = Date.now()
        if (lastConversation) {
            response = await api.sendMessage(prompt, lastConversation)
        } else {
            response = await api.sendMessage(prompt)
        }
        const end = Date.now() - start

        console.log(`[Whatsapp ChatGPT] Answer to ${message.from}: ${response.text}`)

        // Set the conversation
        conversations[message.from] = {
            conversationId: response.conversationId,
            parentMessageId: response.id
        }

        console.log("[Whatsapp ChatGPT] ChatGPT took " + end + "ms")

        // Send the response to the chat
        message.reply(response.text)
    } catch (error: any) {
        console.error("An error occured", error)
        message.reply("An error occured, please contact the administrator. (" + error.message + ")")
    }
}

start()
