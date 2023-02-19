// Whatsapp client
import {Client, LocalAuth} from "whatsapp-web.js";

import {
    onMessage,
    onReady,
    onQRCode,
    onAuthenticated

} from "./listeners";

// Environment variables
require("dotenv").config()

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth()
})

// Entrypoint
const start = async () => {
    // Whatsapp auth
    client.on("qr", onQRCode);

    client.on("authenticated", onAuthenticated);

    // Whatsapp ready
    client.on("ready", onReady)

    // Whatsapp message
    client.on("message", onMessage)

    // Whatsapp initialization
    return client.initialize()
}

start().then(() => {
    console.log("[Whatsapp ChatGPT] Running")
}).catch((error: any) => {
    console.error("An error happened:", error)
})
