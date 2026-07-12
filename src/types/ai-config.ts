import { ICommandsMap } from "./commands";
import { dalleConfigType, dalleImageSize } from "./dalle-config";

export enum aiConfigTarget {
	dalle = "dalle"
	// chatgpt = "chatgpt"
}

export const aiConfigTypes: Record<string, Record<string, string>> = {
	dalle: dalleConfigType
};

export const aiConfigValues: Record<string, Record<string, Record<string, string>>> = {
	dalle: {
		size: dalleImageSize
	}
};

export interface IAiConfig {
	[key: string]: any;
	dalle: {
		size: dalleImageSize;
	};
	commandsMap: {
		[key: string]: ICommandsMap;
	};
}
