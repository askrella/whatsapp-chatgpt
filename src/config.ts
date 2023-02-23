import process from "process";

import { TranscriptionMode } from "./types/transcription-mode";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Config Interface
interface IConfig {
	// OpenAI API Key
	openAIAPIKey: string;
	maxModelTokens: number;

	// Prefix
	prefixEnabled: boolean;
	gptPrefix: string;
	dallePrefix: string;
	aiConfigPrefix: string;

	// Voice transcription & Text-to-Speech
	speechServerUrl: string;
	ttsEnabled: boolean;
	transcriptionEnabled: boolean;
	transcriptionMode: TranscriptionMode;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""
	maxModelTokens: getEnvMaxModelTokens(), // Default: 4096

	// Prefix
	prefixEnabled: getEnvBooleanWithDefault("PREFIX_ENABLED", true), // Default: true
	gptPrefix: process.env.GPT_PREFIX || "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config", // Default: !config

	// Speech API, Default: https://speech-service.verlekar.com
	speechServerUrl: process.env.SPEECH_API_URL || "https://speech-service.verlekar.com",

	// Text-to-Speech
	ttsEnabled: getEnvBooleanWithDefault("TTS_ENABLED", false), // Default: false

	// Transcription
	transcriptionEnabled: getEnvBooleanWithDefault("TRANSCRIPTION_ENABLED", false), // Default: false
	transcriptionMode: getEnvTranscriptionMode() // Default: local
};

/**
 * Get the max model tokens from the environment variable
 * @returns The max model tokens from the environment variable or 4096
 */
function getEnvMaxModelTokens() {
	const envValue = process.env.MAX_MODEL_TOKENS;
	if (envValue == undefined || envValue == "") {
		return 4096;
	}

	return parseInt(envValue);
}

/**
 * Get an environment variable as a boolean with a default value
 * @param key The environment variable key
 * @param defaultValue The default value
 * @returns The value of the environment variable or the default value
 */
function getEnvBooleanWithDefault(key: string, defaultValue: boolean): boolean {
	const envValue = process.env[key]?.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return defaultValue;
	}

	return envValue == "true";
}

/**
 * Get the transcription mode from the environment variable
 * @returns The transcription mode
 */
function getEnvTranscriptionMode(): TranscriptionMode {
	const envValue = process.env.TRANSCRIPTION_MODE?.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return TranscriptionMode.Local;
	}

	return envValue as TranscriptionMode;
}

export default config;
