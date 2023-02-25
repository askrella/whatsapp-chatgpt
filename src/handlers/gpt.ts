import os from "os";
import fs from "fs";
import { randomUUID } from "crypto";
import { ChatMessage } from "chatgpt";
import { Message, MessageMedia } from "whatsapp-web.js";
import { chatgpt } from "../providers/openai";
import * as cli from "../cli/ui";
import config from "../config";
import { ttsRequest } from "../providers/speech";
import { AIType } from "../types/ai-decision";

// Mapping from number to last conversation id
const conversations = {};

const handleMessageGPT = async (message: Message, prompt: string) => {
	try {
		// Get last conversation
		const lastConversation = conversations[message.from];

		cli.print(`[GPT] Received prompt from ${message.from}: ${prompt}`);

		const start = Date.now();

		// Check if we have a conversation with the user
		let response: ChatMessage;
		if (lastConversation) {
			// Handle message with previous conversation
			response = await chatgpt.sendMessage(prompt, lastConversation);
		} else {
			// Handle message with new conversation
			response = await chatgpt.sendMessage(prompt);
		}

		const end = Date.now() - start;

		cli.print(`[GPT] Answer to ${message.from}: ${response.text}  | OpenAI request took ${end}ms)`);

		// Set the conversation
		conversations[message.from] = {
			conversationId: response.conversationId,
			parentMessageId: response.id
		};

		// TTS reply (Default: disabled)
		if (config.ttsEnabled) {
			sendVoiceMessageReply(message, response);
			return;
		}

		// Default: Text reply
		message.reply(response.text);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

const guessMessage = async (message: Message, prompt: string) => {
	try {
		// Get last conversation
		const lastConversation = conversations[message.from];

		cli.print(`[GPT] Received prompt from ${message.from}: ${prompt}`);
		var guessPrompt = `Given the following prompt, should ChatGPT handle this request, or should DALLE, an AI model that generates image? Respond with one word, either ChatGPT or DALLE: ${prompt}`

		const start = Date.now();

		// Check if we have a conversation with the user
		let response: ChatMessage;
		if (lastConversation) {
			// Handle message with previous conversation
			response = await chatgpt.sendMessage(guessPrompt, lastConversation);
		} else {
			// Handle message with new conversation
			response = await chatgpt.sendMessage(guessPrompt);
		}

		const end = Date.now() - start;

		cli.print(`[GPT] Answer to ${message.from}: ${response.text}  | OpenAI request took ${end}ms)`);

		if (response.text.toLowerCase().includes("dalle")) {
			// Assume that ChatGPT thinks it should handle the message
			return AIType.dalle;
		} else {
			return AIType.gpt;
		}

	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

async function sendVoiceMessageReply(message: Message, gptResponse: any) {
	// Get audio buffer
	cli.print(`[Speech API] Generating audio from GPT response "${gptResponse.text}"...`);
	const audioBuffer = await ttsRequest(gptResponse.text);
	cli.print("[Speech API] Audio generated!");

	// Check if audio buffer is valid
	if (audioBuffer == null || audioBuffer.length == 0) {
		message.reply("Speech API couldn't generate audio, please contact the administrator.");
		return;
	}

	// Get temp folder and file path
	const tempFolder = os.tmpdir();
	const tempFilePath = tempFolder + randomUUID() + ".opus";

	// Save buffer to temp file
	fs.writeFileSync(tempFilePath, audioBuffer);

	// Send audio
	const messageMedia = new MessageMedia("audio/ogg; codecs=opus", audioBuffer.toString("base64"));
	message.reply(messageMedia);

	// Delete temp file
	fs.unlinkSync(tempFilePath);
}

export { handleMessageGPT, guessMessage };
