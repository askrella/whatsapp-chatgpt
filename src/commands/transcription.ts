import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";
import { config } from "../config";
import { TranscriptionMode } from "../types/transcription-mode";

export const TranscriptionModule: ICommandModule = {
	key: "transcription",
	register: (): ICommandsMap => {
		return {
			enabled,
			mode
		} as ICommandsMap;
	}
};

const enabled: ICommandDefinition = {
	help: "<value> - Toggle if transcription is enabled",
	hint: "true, false",
	data: config.transcriptionEnabled,
	execute: function (message: Message, valueStr?: string) {
		if (["true", "false"].indexOf(valueStr || "") < 0) {
			message.reply(`Invalid value, please specify true or false`);
			return;
		}
		this.data = valueStr == "true";
		message.reply(`Updated transcription enabled to ${this.data}`);
	}
};

const mode: ICommandDefinition = {
	help: "<value> - Set transcription mode",
	hint: Object.values(TranscriptionMode),
	data: config.transcriptionMode,
	execute: function (message: Message, valueStr?: string) {
		if ((Object.values(TranscriptionMode) as string[]).indexOf(valueStr || "") < 0) {
			message.reply(`Invalid value, available modes are: ${Object.values(TranscriptionMode).join(", ")}`);
			return;
		}
		this.data = valueStr;
		message.reply(`Updated transcription mode to ${this.data}`);
	}
};
