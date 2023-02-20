import { dalleConfigType, dalleImageSize } from "./dalle-config";

export enum aiConfigTarget {
	dalle = "dalle"
	// chatgpt = "chatgpt"
}

export const aiConfigTypes = {
	dalle: dalleConfigType
};

export const aiConfigValues = {
	dalle: {
		size: dalleImageSize
	}
};

export interface IAiConfig {
	dalle: {
		size: dalleImageSize;
	};
}
