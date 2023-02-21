import process from "process";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Interface
interface IConfig {
	openAIAPIKey: string;
	prefixEnabled: boolean;
	gptPrefix: string;
	dallePrefix: string;
	aiConfigPrefix: string;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""
	prefixEnabled: process.env.PREFIX_ENABLED == "true" || true, // Default: true
	gptPrefix: (process.env.GPT_PREFIX != "") ? process.env.GPT_PREFIX : "!gpt", // Default: !gpt
	dallePrefix: (process.env.DALLE_PREFIX != "") ? process.env.DALLE_PREFIX : "!dalle", // Default: !dalle
	aiConfigPrefix: (process.env.AI_CONFIG_PREFIX != "") ? process.env.AI_CONFIG_PREFIX : "!config", // Default: !config
};

export default config;
