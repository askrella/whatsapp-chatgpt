import { Message } from "whatsapp-web.js";
import { startsWithIgnoreCase } from "../utils";

// Config & Constants
import config from "../config";

// CLI
import * as cli from "../cli/ui";

// ChatGPT & DALLE
import { handleMessageGPT, handleDeleteConversation } from "../handlers/gpt";
import { handleMessageDALLE } from "../handlers/dalle";
import { handleMessageAIConfig, getConfig, executeCommand } from "../handlers/ai-config";
import { handleMessageLangChain } from "../handlers/langchain";

// Speech API & Whisper
import { TranscriptionMode } from "../types/transcription-mode";
import { transcribeRequest } from "../providers/speech";
import { transcribeAudioLocal } from "../providers/whisper-local";
import { transcribeWhisperApi } from "../providers/whisper-api";
import { transcribeOpenAI } from "../providers/openai";

// For deciding to ignore old messages
import { botReadyTimestamp } from "../index";

// Handles message
async function handleIncomingMessage(message: Message) {
	let messageString = message.body;

	// Prevent handling old messages
	if (message.timestamp != null) {
		const messageTimestamp = new Date(message.timestamp * 1000);

		// If startTimestamp is null, the bot is not ready yet
		if (botReadyTimestamp == null) {
			cli.print("Ignoring message because bot is not ready yet: " + messageString);
			return;
		}

		// Ignore messages that are sent before the bot is started
		if (messageTimestamp < botReadyTimestamp) {
			cli.print("Ignoring old message: " + messageString);
			return;
		}
	}

	// Ignore groupchats if disabled
	if ((await message.getChat()).isGroup && !config.groupchatsEnabled) return;

	const selfNotedMessage = message.fromMe && message.hasQuotedMsg === false && message.from === message.to;

	if (config.whitelistedEnabled) {
		const whitelistedPhoneNumbers = getConfig("general", "whitelist");

		if (!selfNotedMessage && whitelistedPhoneNumbers.length > 0 && !whitelistedPhoneNumbers.includes(message.from)) {
			cli.print(`Ignoring message from ${message.from} because it is not whitelisted.`);
			return;
		}
	}
	// Transcribe audio
	if (message.hasMedia) {
		const media = await message.downloadMedia();

		// Ignore non-audio media
		if (!media || !media.mimetype.startsWith("audio/")) return;

		// Check if transcription is enabled (Default: false)
		if (!getConfig("transcription", "enabled")) {
			cli.print("[Transcription] Received voice messsage but voice transcription is disabled.");
			return;
		}

		// Convert media to base64 string
		const mediaBuffer = Buffer.from(media.data, "base64");

		// Transcribe locally or with Speech API
		const transcriptionMode = getConfig("transcription", "mode");
		cli.print(`[Transcription] Transcribing audio with "${transcriptionMode}" mode...`);

		let res;
		switch (transcriptionMode) {
			case TranscriptionMode.Local:
				res = await transcribeAudioLocal(mediaBuffer);
				break;
			case TranscriptionMode.OpenAI:
				res = await transcribeOpenAI(mediaBuffer);
				break;
			case TranscriptionMode.WhisperAPI:
				res = await transcribeWhisperApi(new Blob([mediaBuffer]));
				break;
			case TranscriptionMode.SpeechAPI:
				res = await transcribeRequest(new Blob([mediaBuffer]));
				break;
			default:
				cli.print(`[Transcription] Unsupported transcription mode: ${transcriptionMode}`);
		}
		const { text: transcribedText, language: transcribedLanguage } = res;

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
		if (config.ttsTranscriptionResponse) {
			const reply = `You said: ${transcribedText}${transcribedLanguage ? " (language: " + transcribedLanguage + ")" : ""}`;
			message.reply(reply);
		}

		// Handle message GPT
		await handleMessageGPT(message, transcribedText);
		return;
	}

	// Clear conversation context (!clear)
	if (startsWithIgnoreCase(messageString, config.resetPrefix)) {
		await handleDeleteConversation(message, true);
		return;
	}

	// AiConfig (!config <args>)
	if (startsWithIgnoreCase(messageString, config.aiConfigPrefix)) {
		const prompt = messageString.substring(config.aiConfigPrefix.length + 1);
		await handleMessageAIConfig(message, prompt);
		return;
	}

	// GPT (!gpt <prompt>)
	if (startsWithIgnoreCase(messageString, config.gptPrefix)) {
        	if (config.alwaysResetEnabled) {
         		await handleDeleteConversation(message, false);
        	}
		const prompt = messageString.substring(config.gptPrefix.length + 1);
		await handleMessageGPT(message, prompt);
		return;
	}

	// GPT (!lang <prompt>)
	if (startsWithIgnoreCase(messageString, config.langChainPrefix)) {
		const prompt = messageString.substring(config.langChainPrefix.length + 1);
		await handleMessageLangChain(message, prompt);
		return;
	}

	// DALLE (!dalle <prompt>)
	if (startsWithIgnoreCase(messageString, config.dallePrefix)) {
		const prompt = messageString.substring(config.dallePrefix.length + 1);
		await handleMessageDALLE(message, prompt);
		return;
	}

	// Stable Diffusion (!sd <prompt>)
	if (startsWithIgnoreCase(messageString, config.stableDiffusionPrefix)) {
		const prompt = messageString.substring(config.stableDiffusionPrefix.length + 1);
		await executeCommand("sd", "generate", message, prompt);
		return;
	}

	// GPT (only <prompt>)
	if (!config.prefixEnabled || (config.prefixSkippedForMe && selfNotedMessage)) {
		await handleMessageGPT(message, messageString);
		return;
	}
}

export { handleIncomingMessage };
