import process from "process";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Config Interface
interface IConfig {
	// OpenAI API Key
	openAIAPIKey: string;

	// Prefix
	prefixEnabled: boolean;
	gptPrefix: string;
	dallePrefix: string;
	aiConfigPrefix: string;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""

	// Prefix
	prefixEnabled: getEnvBooleanWithDefault("PREFIX_ENABLED", true), // Default: true
	gptPrefix: process.env.GPT_PREFIX || "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config" // Default: !config
};

function getEnvBooleanWithDefault(key: string, defaultValue: boolean): boolean {
	if (process.env[key] == undefined || process.env[key] == "") {
		return defaultValue;
	}
	return process.env[key] == "true";
}

export default config;
