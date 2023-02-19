import type ConfigType from "../types/config";
import { Message } from "whatsapp-web.js";

// ChatGPT & DALLE
import { handleMessageGPT } from "../models/gpt";
import { handleMessageDALLE } from "../models/dalle";

// sends message
export const sendMessage = async (
    { prefixEnabled, gptPrefix, dallePrefix }: ConfigType, message: Message
)=> {
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
