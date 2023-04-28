import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";
import { aiConfigTarget, aiConfigTypes, aiConfigValues, IAiConfig } from "../types/ai-config";
import { aiConfig, getConfig } from "../handlers/ai-config";

export const GeneralModule: ICommandModule = {
	key: "general",
	register: (): ICommandsMap => {
		return {
			settings,
			whitelist
		};
	}
};

const settings: ICommandDefinition = {
	help: "- Get current settings",
	execute: function (message: Message) {
		const selfNotedMessage = message.fromMe && message.hasQuotedMsg === false && message.from === message.to;
		if (!selfNotedMessage) {
			// Only allow printing out the settings on self-noted for security reasons
			return;
		}

		let response = "Runtime settings:";
		for (let module in aiConfig.commandsMap) {
			for (let command in aiConfig.commandsMap[module]) {
				if (aiConfig.commandsMap[module][command].data === undefined) {
					continue;
				}
				let val;
				if (typeof aiConfig.commandsMap[module][command].data === "function") {
					val = aiConfig.commandsMap[module][command].data();
				} else {
					val = aiConfig.commandsMap[module][command].data;
				}
				response += `\n${module} ${command}: ${val}`;
			}
		}

		response += `\n\nStatic settings:`;

		for (let target in aiConfigTarget) {
			for (let type in aiConfigTypes[target]) {
				response += `\n${target} ${type}: ${aiConfig[target][type]}`;
			}
		}

		// Whitelisted fields from config
		[
			"openAIModel",
			"prePrompt",
			"gptPrefix",
			"dallePrefix",
			"stableDiffusionPrefix",
			"resetPrefix",
			"groupchatsEnabled",
			"promptModerationEnabled",
			"promptModerationBlacklistedCategories",
			"ttsMode"
		].forEach((field) => {
			response += `\n${field}: ${config[field]}`;
		});
		message.reply(response);
	}
};

const whitelist: ICommandDefinition = {
	help: "<value> - Set whitelisted phone numbers",
	data: config.whitelistedPhoneNumbers,
	execute: function (message: Message, value?: string) {
		if (!value) {
			message.reply(`Invalid value, please give a comma-separated list of phone numbers.`);
			return;
		}
		this.data = value.split(",");
		message.reply(`Updated whitelist phone numbers to ${this.data}`);
	}
};
