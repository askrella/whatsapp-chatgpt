import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";

export const GeneralModule: ICommandModule = {
	key: "general",
	register: (): ICommandsMap => {
		return {
			whitelist
		};
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
