import { ICommandModule, ICommandDefinition, ICommandsMap } from "../types/commands";
import { Message } from "whatsapp-web.js";

export const ChatModule: ICommandModule = {
	key: "chat",
	register: (): ICommandsMap => {
		return {
			id
		};
	}
};

const id: ICommandDefinition = {
	help: "- Get the ID of the chat",
	execute: (message: Message) => {
		message.reply(message.to);
	}
};
