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
	gptPrefix: "!gpt",
	dallePrefix: "!dalle",
	aiConfigPrefix: "!config"
};

export default config;
