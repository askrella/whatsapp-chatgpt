import { Message } from "whatsapp-web.js";

export interface ICommandExecution {
	(message: Message, value?: string): void;
}

export interface ICommandDefinition {
	data?: any;
	help: string;
	hint?: string | Object | undefined;
	execute: ICommandExecution;
}

export interface ICommandsMap {
	[key: string]: ICommandDefinition;
}

export interface ICommandModule {
	key: string;
	register: () => ICommandsMap;
}
