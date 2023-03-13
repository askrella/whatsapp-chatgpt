import { dalleConfigType, dalleImageSize } from "./dalle-config";
import { generalConfigType } from "./general-config";

export enum aiConfigTarget {
	general = "general",
	dalle = "dalle"
	// chatgpt = "chatgpt"
}

export const aiConfigTypes = {
	general: generalConfigType,
	dalle: dalleConfigType,
};

export const aiConfigValues = {
	general: {
		whitelist: "",
	},
	dalle: {
		size: dalleImageSize
	}
};

export interface IAiConfig {
	general: {
		whitelist: string;
	};
	dalle: {
		size: dalleImageSize;
	};
}
