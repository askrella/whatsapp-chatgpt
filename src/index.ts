const process = require("process")
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
import { ChatGPTAPI } from "chatgpt" // ESM import

// Environment variables
require("dotenv").config()

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
const prefix = '!gpt'

// Whatsapp Client
const client = new Client()

// ChatGPT Client
const api = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN!!,
    clearanceToken: process.env.CLEARANCE_TOKEN,
    userAgent: process.env.USER_AGENT,
})

// User to conversation mapping
const conversations: any = {}

// Entrypoint
const start = async () => {
    // Validate env
    if (process.env.SESSION_TOKEN == null) {
        console.error("[Whatsapp ChatGPT] Please set the SESSION_TOKEN environment variable in .env file.")
        process.exit(1)
    }

    // Ensure the API is properly authenticated
    try {
        await api.ensureAuth()
    } catch (error: any) {
        console.error("[Whatsapp ChatGPT] Failed to authenticate with the ChatGPT API: " + error.message)
        process.exit(1)
    }

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
        if (conversations[message.from] == null) {
            conversations[message.from] = api.getConversation()
            console.log("[Whatsapp ChatGPT] Created new conversation for " + message.from)
        }

        const conversation = conversations[message.from]

        // Send the prompt to the API
        console.log("[Whatsapp ChatGPT] Received prompt from " + message.from + ": " + prompt)
        const response = await conversation.sendMessage(prompt)

        // Send the response to the chat
        message.reply(response)
    } catch (error: any) {
        message.reply("An error occured, please try again. (" + error.message + ")")
    }  
}

start()
