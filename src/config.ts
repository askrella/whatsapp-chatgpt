import process from "process";

import { TranscriptionMode } from "./types/transcription-mode";
import { TTSMode } from "./types/tts-mode";
import { AWSPollyEngine } from "./types/aws-polly-engine";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Config Interface
interface IConfig {
	// OpenAI
	openAIAPIKey: string;
	maxModelTokens: number;
	prePrompt: string | undefined;

	// Prefix
	prefixEnabled: boolean;
	prefixSkippedForMe: boolean;
	gptPrefix: string;
	dallePrefix: string;
	resetPrefix: string;
	aiConfigPrefix: string;

	// Prompt Moderation
	promptModerationEnabled: boolean;
	promptModerationBacklistedCategories: string[];

	// AWS
	awsAccessKeyId: string;
	awsSecretAccessKey: string;
	awsRegion: string;
	awsPollyVoiceId: string;
	awsPollyEngine: AWSPollyEngine;

	// Voice transcription & Text-to-Speech
	speechServerUrl: string;
	whisperServerUrl: string;
	openAIServerUrl: string;
	whisperApiKey: string;
	ttsEnabled: boolean;
	ttsMode: TTSMode;
	transcriptionEnabled: boolean;
	transcriptionMode: TranscriptionMode;
	transcriptionLanguage: string;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""
	maxModelTokens: getEnvMaxModelTokens(), // Default: 4096
	prePrompt: process.env.PRE_PROMPT, // Default: undefined

	// Prefix
	prefixEnabled: getEnvBooleanWithDefault("PREFIX_ENABLED", true), // Default: true
	prefixSkippedForMe: getEnvBooleanWithDefault("PREFIX_SKIPPED_FOR_ME", true), // Default: true
	gptPrefix: process.env.GPT_PREFIX || "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	resetPrefix: process.env.RESET_PREFIX || "!reset", // Default: !reset
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config", // Default: !config

	// Prompt Moderation
	promptModerationEnabled: getEnvBooleanWithDefault("PROMPT_MODERATION_ENABLED", false), // Default: false
	promptModerationBacklistedCategories: getEnvStringArrayWithDefault("PROMPT_MODERATION_BACKLISTED_CATEGORIES", [
		? JSON.parse(process.env.PROMPT_MODERATION_BACKLISTED_CATEGORIES.replace(/'/g, '"')) || [
		"hate",
		"hate/threatening",
		"self-harm",
		"sexual",
		"sexual/minors",
		"violence",
		"violence/graphic"
	]), // Default: ["hate", "hate/threatening", "self-harm", "sexual", "sexual/minors", "violence", "violence/graphic"]
		: ["hate", "hate/threatening", "self-harm", "sexual", "sexual/minors", "violence", "violence/graphic"],

	// AWS
	awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Default: ""
	awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // Default: ""
	awsRegion: process.env.AWS_REGION || "", // Default: ""
	awsPollyVoiceId: process.env.AWS_POLLY_VOICE_ID || "", // Default: "Joanna"
	awsPollyEngine: getEnvAWSPollyVoiceEngine(), // Default: standard

	// Speech API, Default: https://speech-service.verlekar.com
	speechServerUrl: process.env.SPEECH_API_URL || "https://speech-service.verlekar.com",
	whisperServerUrl: process.env.WHISPER_API_URL || "https://transcribe.whisperapi.com",
	openAIServerUrl: process.env.OPENAI_API_URL || "https://api.openai.com/v1/audio/transcriptions",
	whisperApiKey: process.env.WHISPER_API_KEY || "", // Default: ""

	// Text-to-Speech
	ttsEnabled: getEnvBooleanWithDefault("TTS_ENABLED", false), // Default: false
	ttsMode: getEnvTTSMode(), // Default: speech-api

	// Transcription
	transcriptionEnabled: getEnvBooleanWithDefault("TRANSCRIPTION_ENABLED", false), // Default: false
	transcriptionMode: getEnvTranscriptionMode(), // Default: local
	transcriptionLanguage: process.env.TRANSCRIPTION_LANGUAGE || "" // Default: null
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
 * Get environment variables as a array of strings with a default value
 * @param key The environment variable key
 * @param defaultValue The default value
 * @returns The value of the environment variable or the default value
 */
function getEnvStringArrayWithDefault(key: string, defaultValue: string[]): string[] {
	const envValue = process.env[key];
	if (envValue == undefined || envValue == "") {
		return defaultValue;
	} else {
		return JSON.parse(envValue.replace(/'/g, '"'));
	}
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

/**
 * Get the tss mode from the environment variable
 * @returns The tts mode
 */
function getEnvTTSMode(): TTSMode {
	const envValue = process.env.TTS_MODE?.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return TTSMode.SpeechAPI;
	}

	return envValue as TTSMode;
}

/**
 * Get the AWS Polly voice engine from the environment variable
 * @returns The voice engine
 */
function getEnvAWSPollyVoiceEngine(): AWSPollyEngine {
	const envValue = process.env.AWS_POLLY_VOICE_ENGINE?.toLowerCase();
	if (envValue == undefined || envValue == "") {
		return AWSPollyEngine.Standard;
	}

	return envValue as AWSPollyEngine;
}

export default config;
