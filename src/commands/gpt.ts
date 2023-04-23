import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";

export const GptModule: ICommandModule = {
	key: "gpt",
	register: (): ICommandsMap => {
		return {
			maxModelTokens
		};
	}
};

const maxModelTokens: ICommandDefinition = {
	help: "<value> - Set max model tokens value",
	hint: "integer",
	data: config.maxModelTokens,
	execute: function (message: Message, valueStr?: string) {
		const value = parseInt(valueStr || "");
		if (!value || isNaN(value)) {
			message.reply(`Invalid value, please give an integer value`);
			return;
		}
		this.data = value;
		message.reply(`Updated max model tokens to ${this.data}`);
	}
};
