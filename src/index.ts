const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

// ChatGPT & DALLE
import { handleMessageGPT } from './gpt'
import { handleMessageDALLE } from './dalle'

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Prefixes
const prefixEnabled = process.env.PREFIX_ENABLED == "true"
// const shouldReplySelf = process.env.REPLY_SELF_ENABLED == "true"
const gptPrefix = '!gpt'
const dallePrefix = '!dalle'
const selfGptPrefix = '!megpt'
const selfDallePrefix = '!medalle'

// Whatsapp Client
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    }
});

// sends message
async function sendMessage(message:any) {
    const messageString = message.body

    if (messageString.length == 0) return;

    if (!prefixEnabled) {
        // GPT (only <prompt>)
        await handleMessageGPT(message, messageString);
        return
    }

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
}

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
        if (message.from == "status@broadcast") return
        await sendMessage(message);
    })
    
/*     // reply to own message
    client.on("message_create", async(message) => {
        if (message.fromMe && shouldReplySelf) {
            await sendMessage(message);
        }
    }); */

  // Whatsapp message to onself
  client.on("message_create", async (message: any) => {
    const messageString = message.body;
    if (messageString.length == 0) return;
    if (message.from == "status@broadcast") return;

    if (message.fromMe === true && message.id.self === "out") {
      // This can only work if prefix is used
      // GPT (!gpt <prompt>)
      if (messageString.startsWith(selfGptPrefix)) {
        const prompt = messageString.substring(selfGptPrefix.length + 1);
        await handleMessageGPT(message, prompt);
        return;
      }

      // DALLE (!dalle <prompt>)
      if (messageString.startsWith(selfDallePrefix)) {
        const prompt = messageString.substring(selfDallePrefix.length + 1);
        await handleMessageDALLE(message, prompt);
        return;
      }
    }
  });

    // Whatsapp initialization
    client.initialize()
}

start()
