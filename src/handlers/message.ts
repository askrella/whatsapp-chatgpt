import { Message } from "whatsapp-web.js";
import { startsWithIgnoreCase } from "../utils";

// Config & Constants
import { config } from "../env/env-variables";

// CLI
import * as cli from "../cli/ui";

// ChatGPT & DALLE
import { handleMessageGPT, handleDeleteConversation } from "../handlers/gpt";
import { handleMessageDALLE } from "../handlers/dalle";
import { handleMessageAIConfig } from "../handlers/ai-config";

// Speech API & Whisper
import { transcribeRequest } from "../providers/speech";
import { transcribeAudioLocal } from "../providers/whisper-local";

// Handles message
async function handleIncomingMessage(message: Message) {
	let messageString = message.body;

	// Transcribe audio
	if (message.hasMedia) {
		const media = await message.downloadMedia();
		if (!media.mimetype.startsWith("audio/")) return;

		// Check if transcription is enabled (Default: false)
		if (!config.TRANSCRIPTION_ENABLED) {
			cli.print("[Transcription] Received voice message but voice transcription is disabled.");
			return;
		}

		const mediaBuffer = Buffer.from(media.data, "base64");
		let transcribedText, transcribedLanguage;

		// Transcribe locally or with Speech API
		cli.print(`[Transcription] Transcribing audio with "${config.TRANSCRIPTION_MODE}" mode...`);

		if (config.TRANSCRIPTION_MODE === "local") {
			const { text, language } = await transcribeAudioLocal(mediaBuffer);
			transcribedText = text;
			transcribedLanguage = language;
		}

		if (config.TRANSCRIPTION_MODE == "speech-api") {
			const { text, language } = await transcribeRequest(new Blob([mediaBuffer]));
			transcribedText = text;
			transcribedLanguage = language;
		}

		if (transcribedText == null) {
			return message.reply("I couldn't understand what you said.");
		}

		// checking if transcription is empty (silent voice message)
		if (transcribedText.length == 0) {
			return message.reply("I couldn't understand what you said.");
		}

		cli.print(`[Transcription] Transcription response: ${transcribedText} (language: ${transcribedLanguage})`);

		await message.reply("You said: " + transcribedText + " (language: " + transcribedLanguage + ")");
		await handleMessageGPT(message, transcribedText);

		return;
	}

	// Clear conversation context (!clear)
	if (startsWithIgnoreCase(messageString, config.RESET_PREFIX)) {
		await handleDeleteConversation(message);
	}

	// AiConfig (!config <args>)
	if (startsWithIgnoreCase(messageString, config.AI_CONFIG_PREFIX)) {
		const prompt = messageString.substring(config.AI_CONFIG_PREFIX.length + 1);
		return handleMessageAIConfig(message, prompt);
	}

	// GPT (only <prompt>)
	if (!config.PREFIX_ENABLED) {
		return handleMessageGPT(message, messageString);
	}

	// GPT (!gpt <prompt>)
	if (startsWithIgnoreCase(messageString, config.GPT_PREFIX)) {
		const prompt = messageString.substring(config.GPT_PREFIX.length + 1);
		return handleMessageGPT(message, prompt);
	}

	// DALLE (!dalle <prompt>)
	if (startsWithIgnoreCase(messageString, config.DALLE_PREFIX)) {
		const prompt = messageString.substring(config.DALLE_PREFIX.length + 1);
		return handleMessageDALLE(message, prompt);
	}
}

export { handleIncomingMessage };
