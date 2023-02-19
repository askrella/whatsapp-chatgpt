import qrcode from "qrcode-terminal";
import { Client, Message, Events } from "whatsapp-web.js";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// ChatGPT & DALLE
import { handleMessageGPT } from "./gpt";
import { handleMessageDALLE } from "./dalle";

import * as cli from '../cli/ui'

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
	if (messageString.startsWith(gptPrefix)) {
		const prompt = messageString.substring(gptPrefix.length + 1);
		await handleMessageGPT(message, prompt);
		return;
	}

	// DALLE (!dalle <prompt>)
	if (messageString.startsWith(dallePrefix)) {
		const prompt = messageString.substring(dallePrefix.length + 1);
		await handleMessageDALLE(message, prompt);
		return;
	}
}

// Entrypoint
const start = async () => {
	cli.printIntro();

	// Whatsapp auth
	client.on(Events.QR_RECEIVED, (qr: string) => {
		qrcode.generate(qr, { small: true }, (qrcode: string) => {
			cli.printQRCode(qrcode);
		});
	});

	// Whatsapp loading
	client.on(Events.LOADING_SCREEN, (percent) => {
		if (percent == '0') {
			cli.printLoading()
		}
	});

	// Whatsapp ready
	client.on(Events.READY, () => {
		cli.printOutro()
	});

	// Whatsapp message
	client.on(Events.MESSAGE_RECEIVED, async (message: any) => {
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
	client.on(Events.MESSAGE_CREATE, async (message: Message) => {
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
