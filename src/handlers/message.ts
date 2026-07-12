import { Message } from "whatsapp-web.js";
import { extractCommandPrompt } from "../utils";

// Config & Constants
import config from "../config";

// CLI
import * as cli from "../cli/ui";

// ChatGPT & DALLE
import { handleMessageGPT, handleDeleteConversation } from "../handlers/gpt";
import { handleMessageDALLE } from "../handlers/dalle";
import { handleMessageAIConfig, getConfig, executeCommand } from "../handlers/ai-config";
import { handleMessageWebSearch } from "../handlers/web-search";

// Speech API & Whisper
import { TranscriptionMode } from "../types/transcription-mode";
import { transcribeRequest } from "../providers/speech";
import { transcribeAudioLocal } from "../providers/whisper-local";
import { transcribeWhisperApi } from "../providers/whisper-api";
import { transcribeAudioWithAI } from "../providers/ai";

// For deciding to ignore old messages
import { getBotReadyTimestamp } from "../runtime-state";

// Handles message
async function handleIncomingMessage(message: Message) {
	let messageString = message.body;

	// Prevent handling old messages
	if (message.timestamp != null) {
		const messageTimestamp = new Date(message.timestamp * 1000);
		const botReadyTimestamp = getBotReadyTimestamp();

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
			cli.print("[Transcription] Received voice message but voice transcription is disabled.");
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
				res = await transcribeAudioWithAI(mediaBuffer);
				break;
			case TranscriptionMode.WhisperAPI:
				res = await transcribeWhisperApi(new Blob([new Uint8Array(mediaBuffer)]));
				break;
			case TranscriptionMode.SpeechAPI:
				res = await transcribeRequest(new Blob([new Uint8Array(mediaBuffer)]));
				break;
			default:
				cli.print(`[Transcription] Unsupported transcription mode: ${transcriptionMode}`);
				return;
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
	if (extractCommandPrompt(messageString, config.resetPrefix) !== null) {
		await handleDeleteConversation(message);
		return;
	}

	// AiConfig (!config <args>)
	const aiConfigPrompt = extractCommandPrompt(messageString, config.aiConfigPrefix);
	if (aiConfigPrompt !== null) {
		const prompt = aiConfigPrompt;
		await handleMessageAIConfig(message, prompt);
		return;
	}

	// GPT (!gpt <prompt>)
	const gptPrompt = extractCommandPrompt(messageString, config.gptPrefix);
	if (gptPrompt !== null) {
		const prompt = gptPrompt;
		await handleMessageGPT(message, prompt);
		return;
	}

	// GPT (!lang <prompt>)
	const langChainPrompt = extractCommandPrompt(messageString, config.langChainPrefix);
	if (langChainPrompt !== null) {
		const prompt = langChainPrompt;
		await handleMessageWebSearch(message, prompt);
		return;
	}

	// DALLE (!dalle <prompt>)
	const dallePrompt = extractCommandPrompt(messageString, config.dallePrefix);
	if (dallePrompt !== null) {
		const prompt = dallePrompt;
		await handleMessageDALLE(message, prompt);
		return;
	}

	// Stable Diffusion (!sd <prompt>)
	const stableDiffusionPrompt = extractCommandPrompt(messageString, config.stableDiffusionPrefix);
	if (stableDiffusionPrompt !== null) {
		const prompt = stableDiffusionPrompt;
		await executeCommand("sd", "generate", message, prompt);
		return;
	}

	// GPT (only <prompt>)
	if (!config.prefixEnabled || (config.prefixSkippedForMe && selfNotedMessage)) {
		await handleMessageGPT(message, messageString);
		return;
	}
}

async function handleIncomingMessageSafely(message: Message): Promise<void> {
	try {
		await handleIncomingMessage(message);
	} catch (error) {
		cli.printError(`Failed to handle message from ${message.from}: ${error instanceof Error ? error.message : String(error)}`);
		try {
			await message.reply("I couldn't process that message. Please try again.");
		} catch (replyError) {
			cli.printError(`Failed to send error reply: ${replyError instanceof Error ? replyError.message : String(replyError)}`);
		}
	}
}

export { handleIncomingMessage, handleIncomingMessageSafely };
