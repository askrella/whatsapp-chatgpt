const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
import { ChatGPTAPI } from "chatgpt"

// Environment variables
require('dotenv').config()

// Whatsapp Client
const client = new Client()

// ChatGPT Client
const api = new ChatGPTAPI({
    sessionToken: process.env.SESSION_TOKEN!!
})

const start = async () => {
    // Ensure the API is properly authenticated
    await api.ensureAuth()

    // Whatsapp auth
    client.on('qr', (qr: string) => {
        console.log("Scan this QR code with your phone to log in:")
        qrcode.generate(qr, { small: true });
    })

    // Whatsapp ready
    client.on('ready', () => {
        console.log('Client is ready!');
    })

    // Whatsapp message
    client.on('message', async (message: any) => {
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
                message.reply("Es ist ein Fehler aufgetreten, versuche es später noch einmal. (" + error.message + ")")
            }
        }

        // Only for test
        if (message.body == '!ping') {
            message.reply('pong');
        }
    })

    client.initialize()
}

start()
