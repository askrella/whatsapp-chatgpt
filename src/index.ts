const process = require("process")
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const { MessageMedia } = require('whatsapp-web.js');

import { ChatGPTAPI } from 'chatgpt'
import { Configuration, OpenAIApi } from "openai";

// Environment variables
require("dotenv").config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
// const prefix = '!gpt'
const prefix_gpt = process.env.PREFIX_GPT
const prefix_dalle = process.env.PREFIX_DALLE

// Whatsapp Client
const client = new Client()

// ChatGPT Client
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
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
        if (message.body.length == 0) return
        if (message.from == "status@broadcast") return

        if (prefixEnabled) {
            if (message.body.startsWith(prefix_gpt)) {
                // Get the rest of the message
                const prompt = message.body.substring(prefix_gpt.length + 1);
                await handleMessageGPT(message, prompt)
            }
            if (message.body.startsWith(prefix_dalle)) {
                // Get the rest of the message
                const prompt = message.body.substring(prefix_dalle.length + 1);
                await handleMessageDALLE(message, prompt)
            }
        } else {
            await handleMessageGPT(message, message.body)
        }
    })

    client.initialize()
}

const handleMessageGPT = async (message: any, prompt: any) => {
    try {
        const start = Date.now()

        // Send the prompt to the API
        console.log("[Whatsapp ChatGPT] Received prompt from " + message.from + ": " + prompt)
        const response = await api.sendMessage(prompt)

        console.log(`[Whatsapp ChatGPT] Answer to ${message.from}: ${response.text}`)

        const end = Date.now() - start

        console.log("[Whatsapp ChatGPT] ChatGPT took " + end + "ms")

        // Send the response to the chat
        message.reply(response.text)
    } catch (error: any) {
        console.error("An error occured", error)
        message.reply("An error occured, please contact the administrator. (" + error.message + ")")
    }
}

const handleMessageDALLE = async (message: any, prompt: any) => {
    try {
        const start = Date.now()

        // Send the prompt to the API
        console.log("[Whatsapp DALLE] Received prompt from " + message.from + ": " + prompt)
        // const response = await api.sendMessage(prompt)
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "256x256",
            response_format: "b64_json"
        });
        // const image_url = response.data.data[0].url;
        const base64 = response.data.data[0].b64_json;
        const image = await new MessageMedia("image/jpeg", base64, "image.jpg");

        // console.log(`[Whatsapp DALLE] Answer to ${message.from}: ${response.text}`)
        // console.log(`[Whatsapp DALLE] Answer to ${message.from}: ${image_url}`)
        console.log(`[Whatsapp DALLE] Answer to ${message.from}`)

        const end = Date.now() - start

        console.log("[Whatsapp DALLE] DALLE took " + end + "ms")

        // Send the response to the chat
        // message.reply(response.text)
        // message.reply(image_url)
        message.reply(image)
    } catch (error: any) {
        console.error("An error occured", error)
        message.reply("An error occured, please contact the administrator. (" + error.message + ")")
    }
}

start()
