import {LocalAuth} from "whatsapp-web.js";

const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

// Listeners
import { onMessage } from "./events-callbacks";

// Environment variables
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
    client.on("message", onMessage)

    // Whatsapp initialization
    client.initialize()
}

start()
