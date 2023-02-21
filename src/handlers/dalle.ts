import { MessageMedia } from "whatsapp-web.js";
import { openai } from "../providers/openai";
import { aiConfig } from "../handlers/ai-config";
import { CreateImageRequestSizeEnum } from "openai";

import * as cli from "../cli/ui";

const handleMessageDALLE = async (message: any, prompt: any) => {
	try {
		const start = Date.now();

		cli.print(`[DALL-E] Received prompt from ${message.from}: ${prompt}`);

		// Send the prompt to the API
		const response = await openai.createImage({
			prompt: prompt,
			n: 1,
			size: aiConfig.dalle.size as CreateImageRequestSizeEnum,
			response_format: "b64_json"
		});

		const end = Date.now() - start;

		const base64 = response.data.data[0].b64_json as string;
		const image = new MessageMedia("image/jpeg", base64, "image.jpg");

		cli.print(`[DALL-E] Answer to ${message.from} | OpenAI request took ${end}ms`);

		message.reply(image);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageDALLE };
