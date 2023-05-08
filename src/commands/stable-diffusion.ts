import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message, MessageMedia } from "whatsapp-web.js";
import * as cli from "../cli/ui";

export const StableDiffusionModule: ICommandModule = {
	key: "sd",
	register: (): ICommandsMap => {
		return {
			setModel,
			generate
		};
	}
};

let model = "runwayml/stable-diffusion-v1-5";

const setModel: ICommandDefinition = {
	help: "<value> - Set the model to be used of Stable Diffusion (with huggingface)",
	hint: "runwayml/stable-diffusion-v1-5",
	data: model,
	execute: function (message: Message, valueStr?: string) {
		if (!valueStr) {
			message.reply(`Invalid value, please give a model name.`);
			return;
		}
		this.data = valueStr;
		model = valueStr;
		message.reply(`Updated model to ${this.data}`);
	}
};

const generate: ICommandDefinition = {
	help: "<prompt> - Given the prompt, generate an image using Stable Diffusion (with huggingface)",
	hint: 'A magical and adventurous story about "The Littlest Pudu."',
	execute: async (message: Message, valueStr?: string) => {
		try {
			const start = Date.now();

			cli.print(`[Stable Diffusion] Received prompt from ${message.from}: ${valueStr}`);

			const huggingFaceAPIToken = process.env.HUGGINGFACE_API_TOKEN;

			if (!huggingFaceAPIToken) {
				throw new Error("[Stable Diffusion] Huggingface API token not found, set the HUGGINGFACE_API_TOKEN environment variable");
			}

			const url = `https://api-inference.huggingface.co/models/${model}`;
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${huggingFaceAPIToken}`
				},
				body: JSON.stringify({
					inputs: valueStr,
					options: {
						wait_for_model: true
					}
				})
			};
			const response = await fetch(url, options);
			const end = Date.now() - start;
			const imageBlob = await response.blob();
			const contentType = response.headers.get("Content-Type") || "image/jpeg";
			const buffer = Buffer.from(await imageBlob.arrayBuffer());
			const image = new MessageMedia(contentType, buffer.toString("base64"));

			cli.print(`[Stable Diffusion] Answer to ${message.from} | Huggingface request took ${end}ms`);

			message.reply(image);
		} catch (error: any) {
			console.error("An error occurred", error);
			message.reply("An error occurred, please contact the administrator. (" + error.message + ")");
		}
	}
};
