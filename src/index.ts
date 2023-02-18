const process = require("process");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
import { ChatGPTAPI, ChatMessage } from 'chatgpt';

// Environment variables
require("dotenv").config();

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED == "true";
const prefix = '!gpt';

// WhatsApp Client
const client = new Client();

// ChatGPT Client
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
});

// Mapping from number to last conversation id
const conversations = {};

// Loading spinner
const loadingSpinner = [
  "|",
  "/",
  "-",
  "\\"
];
let loadingSpinnerIndex = 0;

// Entry point
const start = async () => {
    // WhatsApp auth
    client.on("qr", (qr: string) => {
        console.log("[WhatsApp ChatGPT] Scan this QR code in WhatsApp to log in:");
        qrcode.generate(qr, { small: true });
    });

    // WhatsApp ready
    client.on("ready", () => {
        console.log("[WhatsApp ChatGPT] Client is ready!");
    });

    // WhatsApp message
    client.on("message", async (message: any) => {
        if (message.body.length == 0) return;
        if (message.from == "status@broadcast") return;

        if (prefixEnabled) {
            if (message.body.startsWith(prefix)) {
                // Get the rest of the message
                const prompt = message.body.substring(prefix.length + 1);
                await handleMessage(message, prompt);
            }
        } else {
            await handleMessage(message, message.body);
        }
    });

    client.initialize();
};

const handleMessage = async (message: any, prompt: any) => {
    try {
        const lastConversation = conversations[message.from];

        // Add the message to the conversation
        console.log("[WhatsApp ChatGPT] Received prompt from " + message.from + ": " + prompt);

        // Display the loading spinner while the chatbot generates a response
        const loadingSpinnerInterval = setInterval(() => {
          process.stdout.write(`\r[WhatsApp ChatGPT] ChatGPT is thinking ${loadingSpinner[loadingSpinnerIndex]}`);
          loadingSpinnerIndex = (loadingSpinnerIndex + 1) % loadingSpinner.length;
        }, 100);

        let response: ChatMessage;

        const start = Date.now();
        if (lastConversation) {
            response = await api.sendMessage(prompt, lastConversation);
        } else {
            response = await api.sendMessage(prompt);
        }
        const end = Date.now() - start;

        clearInterval(loadingSpinnerInterval);
        process.stdout.write(`\r[WhatsApp ChatGPT] ChatGPT took ${end}ms to generate the response.      \n`);

        console.log(`[WhatsApp ChatGPT] Answer to ${message.from}: ${response.text}`);

        // Set the conversation
        conversations[message.from] = {
            conversationId: response.conversationId,
            parentMessageId: response.id
        };

        // Send the response to the chat
        message.reply(response.text);
    } catch (error: any) {
        console.error("An error occured", error);
        message.reply("An error occured, please contact the administrator. (" + error.message + ")");
    }
};

start();
