import { Message } from "whatsapp-web.js";
import { startsWithIgnoreCase } from "../utils";

// Config & Constants
import config from "../config";

// CLI
import * as cli from "../cli/ui";

// ChatGPT & DALLE
import { handleMessageGPT } from "../handlers/gpt";
import { handleMessageDALLE } from "../handlers/dalle";
import { handleMessageAIConfig } from "../handlers/ai-config";

// Speech API & Whisper
import { TranscriptionMode } from "../types/transcription-mode";
import { transcribeRequest } from "../providers/speech";
import { transcribeAudioLocal } from "../providers/whisper-local";

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
			cli.print("[Transcription] Received voice messsage but voice transcription is disabled.");
			return;
		}

		// Convert media to base64 string
		const mediaBuffer = Buffer.from(media.data, "base64");

		let transcribedText, transcribedLanguage;

		// Transcribe locally or with Speech API
		cli.print(`[Transcription] Transcribing audio with "${config.transcriptionMode}" mode...`);

		if (config.transcriptionMode == TranscriptionMode.Local) {
			const { text, language } = await transcribeAudioLocal(mediaBuffer);
			transcribedText = text;
			transcribedLanguage = language;
		} else if (config.transcriptionMode == TranscriptionMode.SpeechAPI) {
			const { text, language } = await transcribeRequest(new Blob([mediaBuffer]));
			transcribedText = text;
			transcribedLanguage = language;
		}

		// Check transcription is null (error)
		if (transcribedText == null) {
			message.reply("I couldn't understand what you said.");
			return;
		}

		// Check transcription is empty (silent voice message)
		if (transcribedText.length == 0) {
			message.reply("I couldn't understand what you said.");
			return;
		}

		// Log transcription
		cli.print(`[Transcription] Transcription response: ${transcribedText} (language: ${transcribedLanguage})`);

		// Reply with transcription
		message.reply("You said: " + transcribedText + " (language: " + transcribedLanguage + ")");

		// Handle message GPT
		await handleMessageGPT(message, transcribedText);
		return;
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
