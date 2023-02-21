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
	prefixEnabled: getEnvBooleanWithDefault("PREFIX_ENABLED", true), // Default: true
	gptPrefix: process.env.GPT_PREFIX || "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config", // Default: !config

	// Transcription & Text-to-Speech
	ttsEnabled: getEnvBooleanWithDefault("TTS_ENABLED", false), // Default: false
	transcriptionEnabled: getEnvBooleanWithDefault("TRANSCRIPTION_ENABLED", false) // Default: false
}

// Disable TTS since it's really experimental
config.ttsEnabled = false;

/**
 * Get an environment variable as a boolean with a default value
 * @param key The environment variable key
 * @param defaultValue The default value
 * @returns The value of the environment variable or the default value
 */
function getEnvBooleanWithDefault(key: string, defaultValue: boolean): boolean {
	if (process.env[key] == undefined || process.env[key] == "") {
		return defaultValue;
	}
	return process.env[key] == "true";
}

export default config;
