import { Message } from "whatsapp-web.js";
import { aiConfigTarget, aiConfigTypes, aiConfigValues, IAiConfig } from "../types/ai-config";
import { dalleImageSize } from "../types/dalle-config";

const aiConfig: IAiConfig = {
	dalle: {
		size: dalleImageSize["512x512"]
	}
	// chatgpt: {}
};

const handleMessageAIConfig = async (message: Message, prompt: any) => {
	try {
		console.log("[AI-Config] Received prompt from " + message.from + ": " + prompt);

		const args: string[] = prompt.split(" ");

		/*
			!config
			!config help
		*/
		if (args.length == 1 || prompt === "help") {
			let helpMessage = "Available commands:\n";
			for (let target in aiConfigTarget) {
				for (let type in aiConfigTypes[target]) {
					helpMessage += `\t!config ${target} ${type} <value> - Set ${target} ${type} to <value>\n`;
				}
			}
			helpMessage += "\nAvailable values:\n";
			for (let target in aiConfigTarget) {
				for (let type in aiConfigTypes[target]) {
					helpMessage += `\t${target} ${type}: ${Object.keys(aiConfigValues[target][type]).join(", ")}\n`;
				}
			}
			message.reply(helpMessage);
			return;
		}

		// !config <target> <type> <value>
		if (args.length !== 3) {
			message.reply(
				"Invalid number of arguments, please use the following format: <target> <type> <value> or type !config help for more information."
			);
			return;
		}

		const target: string = args[0];
		const type: string = args[1];
		const value: string = args[2];

		if (!(target in aiConfigTarget)) {
			message.reply("Invalid target, please use one of the following: " + Object.keys(aiConfigTarget).join(", "));
			return;
		}

		if (!(type in aiConfigTypes[target])) {
			message.reply("Invalid type, please use one of the following: " + Object.keys(aiConfigTypes[target]).join(", "));
			return;
		}

		if (!(value in aiConfigValues[target][type])) {
			message.reply("Invalid value, please use one of the following: " + Object.keys(aiConfigValues[target][type]).join(", "));
			return;
		}

		aiConfig[target][type] = value;

		message.reply("Successfully set " + target + " " + type + " to " + value);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { aiConfig, handleMessageAIConfig };
