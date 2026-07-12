import { Message, MessageMedia } from "whatsapp-web.js";
import { sendChatMessage, type ChatHistoryMessage } from "../providers/ai";
import * as cli from "../cli/ui";
import config from "../config";

// TTS
import { ttsRequest as speechTTSRequest } from "../providers/speech";
import { ttsRequest as awsTTSRequest } from "../providers/aws";
import { TTSMode } from "../types/tts-mode";

// Moderation
import { moderateIncomingPrompt } from "./moderation";
import { getConfig } from "./ai-config";

// Mapping from number to last conversation id
const conversations: Record<string, ChatHistoryMessage[]> = {};
const maxConversationMessages = 20;

const handleMessageGPT = async (message: Message, prompt: string) => {
	try {
		const conversation = conversations[message.from] || [];

		cli.print(`[GPT] Received prompt from ${message.from}: ${prompt}`);

		// Prompt Moderation
		if (config.promptModerationEnabled) {
			try {
				await moderateIncomingPrompt(prompt);
			} catch (error: any) {
				message.reply(error.message);
				return;
			}
		}

		const start = Date.now();

		// Check if we have a conversation with the user
		const response = await sendChatMessage(prompt, conversation);
		if (conversation.length === 0) {
			cli.print(`[GPT] New conversation for ${message.from} (ID: ${response.id})`);
		}

		const updatedConversation: ChatHistoryMessage[] = [
			...conversation,
			{ role: "user", content: prompt },
			{ role: "assistant", content: response.text }
		];
		conversations[message.from] = updatedConversation.slice(-maxConversationMessages);

		const end = Date.now() - start;

		cli.print(`[GPT] Answer to ${message.from}: ${response.text}  | OpenAI request took ${end}ms)`);

		// TTS reply (Default: disabled)
		if (getConfig("tts", "enabled")) {
			await sendVoiceMessageReply(message, response.text);
			if (config.ttsTranscriptionResponse) {
				await message.reply(response.text);
			}
			return;
		}

		// Default: Text reply
		await message.reply(response.text);
	} catch (error: any) {
		console.error("An error occurred", error);
		message.reply("An error occurred, please contact the administrator. (" + error.message + ")");
	}
};

const handleDeleteConversation = async (message: Message) => {
	// Delete conversation
	delete conversations[message.from];

	// Reply
	message.reply("Conversation context was reset!");
};

async function sendVoiceMessageReply(message: Message, gptTextResponse: string) {
	let logTag = "[TTS]";
	let ttsRequest = async function (): Promise<Buffer | null> {
		return await speechTTSRequest(gptTextResponse);
	};

	switch (config.ttsMode) {
		case TTSMode.SpeechAPI:
			logTag = "[SpeechAPI]";
			ttsRequest = async function (): Promise<Buffer | null> {
				return await speechTTSRequest(gptTextResponse);
			};
			break;

		case TTSMode.AWSPolly:
			logTag = "[AWSPolly]";
			ttsRequest = async function (): Promise<Buffer | null> {
				return await awsTTSRequest(gptTextResponse);
			};
			break;

		default:
			logTag = "[SpeechAPI]";
			ttsRequest = async function (): Promise<Buffer | null> {
				return await speechTTSRequest(gptTextResponse);
			};
			break;
	}

	// Get audio buffer
	cli.print(`${logTag} Generating audio from GPT response "${gptTextResponse}"...`);
	const audioBuffer = await ttsRequest();

	// Check if audio buffer is valid
	if (audioBuffer == null || audioBuffer.length == 0) {
		message.reply(`${logTag} couldn't generate audio, please contact the administrator.`);
		return;
	}

	cli.print(`${logTag} Audio generated!`);

	// Send audio
	const messageMedia = new MessageMedia("audio/ogg; codecs=opus", audioBuffer.toString("base64"));
	message.reply(messageMedia);
}

export { handleMessageGPT, handleDeleteConversation };
