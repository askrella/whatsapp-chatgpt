import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";

export const TTSModule: ICommandModule = {
	key: "tts",
	register: (): ICommandsMap => {
		return {
			enabled
		};
	}
};

const enabled: ICommandDefinition = {
	help: "<value> - Toggle if TTS is enabled",
	hint: "true, false",
	data: config.ttsEnabled,
	execute: function (message: Message, valueStr?: string) {
		if (["true", "false"].indexOf(valueStr || "") < 0) {
			message.reply(`Invalid value, please specify true or false`);
			return;
		}
		this.data = valueStr == "true";
		message.reply(`Updated TTS enabled to ${this.data}`);
	}
};
