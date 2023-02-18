"use strict";

// Modules
require = require('esm')(module /*, options*/);
import fetch from "node-fetch";
(global as any).fetch = fetch;
const process = require("process")
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
import { Client } from "whatsapp-web.js";
import { ChatGPTAPI, ChatMessage } from 'chatgpt'
dotenv.config();

// Set global fetch for compatibility with qrcode-terminal
(global as any).fetch = fetch;

// Load environment variables
dotenv.config();

// Prefix check
const prefixEnabled = process.env.PREFIX_ENABLED === "true";
const prefix = "!gpt";

// Whatsapp client
const client = new Client();

// ChatGPT client
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
});

// Mapping from number to last conversation id
const conversations: Record<string, any> = {};

// Start the app
const start = async () => {
    // Listen for QR code
    client.on("qr", (qr: string) => {
        console.log("[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:");
        qrcode.generate(qr, { small: true });
    });

    // Listen for ready event
    client.on("ready", () => {
        console.log("[Whatsapp ChatGPT] Client is ready!");
    });

    // Listen for incoming messages
    client.on("message", async (message: any) => {
        if (message.body.length === 0) return;
        if (message.from === "status@broadcast") return;

        // Handle messages with prefix
        const prompt = prefixEnabled ? message.body.substring(prefix.length + 1) : message.body;
        await handleMessage(message, prompt);
    });

    // Initialize the client
    client.initialize();
};

// Handle incoming message
const handleMessage = async (message: any, prompt: any) => {
    try {
        const conversation = conversations[message.from];
        const lastConversation = conversation ? conversation.lastConversation : null;

        // Add the message to the conversation
        console.log(`[Whatsapp ChatGPT] Received prompt from ${message.from}: ${prompt}`);
        const start = Date.now();
        const response = lastConversation ? await api.sendMessage(prompt, lastConversation) : await api.sendMessage(prompt);
        const end = Date.now() - start;

        console.log(`[Whatsapp ChatGPT] Answer to ${message.from}: ${response.text}`);

        // Update conversation history
        conversations[message.from] = {
            lastConversation: response.conversationId,
            parentMessageId: response.id
        };

        console.log(`[Whatsapp ChatGPT] ChatGPT took ${end}ms`);

        // Send the response to the chat
        message.reply(response.text);
    } catch (error: any) {
        console.error("An error occurred", error);
        message.reply(`An error occurred, please contact the administrator. (${error.message})`);
    }
};


start();
