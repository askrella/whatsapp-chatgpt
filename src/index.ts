const process = require("process")
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
import { ChatGPTAPI } from "chatgpt" // ESM import

// Environment variables
require("dotenv").config()

// Whatsapp Client
const client = new Client()

// ChatGPT Client
const api = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN!!
})

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
        // !gpt command
        if (message.body.startsWith("!gpt")) {
            // Get the rest of the message
            const prompt = message.body.substring(5);

            try {
                // Send the prompt to the API
                const response = await api.sendMessage(prompt)

                // Send the response to the chat
                message.reply(response)
            } catch (error: any) {
                message.reply("An error occured, please try again. (" + error.message + ")")
            }
        }
    })

    client.initialize()
}

start()
