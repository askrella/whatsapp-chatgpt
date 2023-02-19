import qrcode from "qrcode-terminal";
import { Client, Message } from "whatsapp-web.js";
import { sendMessage } from "./lib/message";
import type ConfigType from "./types/config";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Whatsapp status (status@broadcast)
const statusBroadcast = "status@broadcast";

// config
const config:ConfigType = {
	prefixEnabled: process.env.PREFIX_ENABLED == "true",
	gptPrefix: "!gpt",
	dallePrefix: "!dalle"
}

// Whatsapp Client
const client = new Client({
	puppeteer: {
		args: ["--no-sandbox"]
	}
});

// Entrypoint
const start = async () => {

	// Whatsapp auth
	client.on("qr", (qr: string) => {
		console.log("[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:");
		qrcode.generate(qr, { small: true });
	});

	// Whatsapp ready
	client.on("ready", () => {
		console.log("[Whatsapp ChatGPT] Client is ready!");
	});

	// Whatsapp message
	client.on("message", async (message: any) => {
		// Ignore if message is from status broadcast
		if (message.from == statusBroadcast) return;

		// Ignore if message is empty or media
		if (message.body.length == 0) return;
		if (message.hasMedia) return;

		// Ignore if it's a quoted message, (e.g. GPT reply)
		if (message.hasQuotedMsg) return;

		await sendMessage(config, message);
	});
	
	// Reply to own message
	client.on("message_create", async (message: Message) => {
		// Ignore if message is from status broadcast
		if (message.from == statusBroadcast) return;

		// Ignore if message is empty or media
		if (message.body.length == 0) return;
		if (message.hasMedia) return;

		// Ignore if it's a quoted message, (e.g. GPT reply)
		if (message.hasQuotedMsg) return;

		// Ignore if it's not from me
		if (!message.fromMe) return;

		await sendMessage(config, message);
	});

	// Whatsapp initialization
	client.initialize();
};

start();
