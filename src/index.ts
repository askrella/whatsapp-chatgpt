import qrcode from "qrcode-terminal";
import { Client, Message } from "whatsapp-web.js";
import startsWithIgnoreCase from "./utils"

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// ChatGPT & DALLE
import { handleMessageGPT } from "./gpt";
import { handleMessageDALLE } from "./dalle";

// Whatsapp status (status@broadcast)
const statusBroadcast = "status@broadcast";

// Prefixes
const prefixEnabled = process.env.PREFIX_ENABLED == "true";
const gptPrefix = "!gpt";
const dallePrefix = "!dalle";

// Whatsapp Client
const client = new Client({
	puppeteer: {
		args: ["--no-sandbox"]
	}
});

// Handles message
async function sendMessage(message: Message) {
	const messageString = message.body;

	if (messageString.length == 0) return;

	if (!prefixEnabled) {
		// GPT (only <prompt>)
		await handleMessageGPT(message, messageString);
		return;
	}

	// GPT (!gpt <prompt>)
	if (startsWithIgnoreCase(messageString, gptPrefix)) {
		const prompt = messageString.substring(gptPrefix.length + 1);
		await handleMessageGPT(message, prompt);
		return;
	}

	// DALLE (!dalle <prompt>)
	if (startsWithIgnoreCase(messageString, dallePrefix)) {
		const prompt = messageString.substring(dallePrefix.length + 1);
		await handleMessageDALLE(message, prompt);
		return;
	}
}

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

		await sendMessage(message);
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

		await sendMessage(message);
	});

	// Whatsapp initialization
	client.initialize();
};

start();
