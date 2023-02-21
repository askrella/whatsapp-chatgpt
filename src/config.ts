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

	// Voice transcription & Text-to-Speech
	ttsEnabled: boolean;
	transcriptionEnabled: boolean;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""

	// Prefix
	prefixEnabled: process.env.PREFIX_ENABLED == "true" || true, // Default: true
	gptPrefix: process.env.GPT_PREFIX || "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config", // Default: !config

	// Transcription & Text-to-Speech
	ttsEnabled: process.env.TTS_ENABLED == "true" || false, // Default: false
	transcriptionEnabled: process.env.TRANSCRIPTION_ENABLED == "true" || false // Default: false
}

export default config;
