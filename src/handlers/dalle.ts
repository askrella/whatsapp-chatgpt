import { MessageMedia } from "whatsapp-web.js";
import { generateAIImage } from "../providers/ai";
import { aiConfig } from "../handlers/ai-config";
import config from "../config";
import * as cli from "../cli/ui";

// Moderation
import { moderateIncomingPrompt } from "./moderation";

const handleMessageDALLE = async (message: any, prompt: any) => {
	try {
		const start = Date.now();

		cli.print(`[DALL-E] Received prompt from ${message.from}: ${prompt}`);

		// Prompt Moderation
		if (config.promptModerationEnabled) {
			try {
				await moderateIncomingPrompt(prompt);
			} catch (error: any) {
				message.reply(error.message);
				return;
			}
		}

		// Send the prompt to the API
		const response = await generateAIImage(prompt, aiConfig.dalle.size);

		const end = Date.now() - start;

		const image = new MessageMedia(response.mediaType, response.base64, "image");

		cli.print(`[DALL-E] Answer to ${message.from} | OpenAI request took ${end}ms`);

		message.reply(image);
	} catch (error: any) {
		console.error("An error occurred", error);
		message.reply("An error occurred, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageDALLE };
