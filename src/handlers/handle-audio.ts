// Speech API & Whisper
import { TranscriptionMode } from "../types/transcription-mode";
import { transcribeRequest } from "../providers/speech";
import { transcribeAudioLocal } from "../providers/whisper-local";
import { transcribeWhisperApi } from "../providers/whisper-api";
import { transcribeOpenAI } from "../providers/openai";
import { getConfig } from "../handlers/ai-config";
import * as cli from "../cli/ui";
import { Message } from "whatsapp-web.js";
import { handleMessageGPT } from "../handlers/gpt";
// import { checkAction } from "../handlers/check-action";
// import { handleMessageDALLE } from "../handlers/dalle";
import { qaChain } from '../providers/qa-chain'

type Media = {
    data: string;
  };

export async function handleAudio (media: Media, message: Message): Promise<void> {
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
		message.reply(`"${transcribedText}"`)
		handleMessageGPT(message, transcribedText, 'qaChain')
		/* For judging and directing to multiple handlers */
		// const actionType = await checkAction(message, transcribedText)
		// console.log('ACTION TYPE', actionType)
		// switch (actionType) {
		// 	case 'image':
		// 		await handleMessageDALLE(message, transcribedText);
		// 		return;
		// 	case 'gpt':
		// 	default:
		// 		await handleMessageGPT(message, transcribedText, 'qaChain');
		// 		return;
		// }
}