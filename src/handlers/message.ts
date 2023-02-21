import { Message } from "whatsapp-web.js";
import { startsWithIgnoreCase } from "../utils";

// Config & Constants
import config from "../config";

// ChatGPT & DALLE
import { handleMessageGPT } from "../handlers/gpt";
import { handleMessageDALLE } from "../handlers/dalle";
import { handleMessageAIConfig } from "../handlers/ai-config";

// Speech API
import { transcribeRequest } from "../providers/speech";

// Handles message
async function handleIncomingMessage(message: Message) {
	let messageString = message.body;

	// Transcribe audio
	if (message.hasMedia) {
		const media = await message.downloadMedia();

		// Ignore non-audio media
		if (!media.mimetype.startsWith("audio/")) return;

		// Check if transcription is enabled (Default: false)
		if (!config.transcriptionEnabled) {
			message.reply("Voice transcription is disabled.");
			return;
		}

		// Convert media to base64 string
		const mediaBuffer = Buffer.from(media.data, "base64");

		// Transcribe with Speech API
		const { text } = await transcribeRequest(new Blob([mediaBuffer]));

		// Check transcription is empty (silent voice message)
		if (text.length == 0) {
			message.reply("I couldn't understand what you said.");
			return;
		}

		// Modify messageString to be handled by GPT
		if (config.prefixEnabled) {
			// Build !gpt <prompt>
			messageString = config.gptPrefix + " " + text;
		} else {
			// Build <prompt>
			messageString = text;
		}
	}

	if (!config.prefixEnabled) {
		// GPT (only <prompt>)
		await handleMessageGPT(message, messageString);
		return;
	}

	// GPT (!gpt <prompt>)
	if (startsWithIgnoreCase(messageString, config.gptPrefix)) {
		const prompt = messageString.substring(config.gptPrefix.length + 1);
		await handleMessageGPT(message, prompt);
		return;
	}

	// DALLE (!dalle <prompt>)
	if (startsWithIgnoreCase(messageString, config.dallePrefix)) {
		const prompt = messageString.substring(config.dallePrefix.length + 1);
		await handleMessageDALLE(message, prompt);
		return;
	}

	// AiConfig (!config <args>)
	if (startsWithIgnoreCase(messageString, config.aiConfigPrefix)) {
		const prompt = messageString.substring(config.aiConfigPrefix.length + 1);
		await handleMessageAIConfig(message, prompt);
		return;
	}
}

export { handleIncomingMessage };
