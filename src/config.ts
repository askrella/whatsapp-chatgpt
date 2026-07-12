import process from "process";

import { TranscriptionMode } from "./types/transcription-mode";
import { TTSMode } from "./types/tts-mode";
import { AWSPollyEngine } from "./types/aws-polly-engine";

// Environment variables
import dotenv from "dotenv";
dotenv.config({ quiet: true });

// Config Interface
export interface IConfig {
	// Access control
	whitelistedPhoneNumbers: string[];
	whitelistedEnabled: boolean;
	// OpenAI
	openAIModel: string;
	openAIImageModel: string;
	openAIModerationModel: string;
	openAITranscriptionModel: string;
	openAIBaseUrl: string | undefined;
	legacyOpenAIApiUrl: string | undefined;
	openAIAPIKeys: string[];
	maxModelTokens: number;
	prePrompt: string | undefined;

	// Prefix
	prefixEnabled: boolean;
	prefixSkippedForMe: boolean;
	gptPrefix: string;
	dallePrefix: string;
	stableDiffusionPrefix: string;
	langChainPrefix: string;
	resetPrefix: string;
	aiConfigPrefix: string;

	// Groupchats
	groupchatsEnabled: boolean;

	// Prompt Moderation
	promptModerationEnabled: boolean;
	promptModerationBlacklistedCategories: string[];

	// AWS
	awsAccessKeyId: string;
	awsSecretAccessKey: string;
	awsRegion: string;
	awsPollyVoiceId: string;
	awsPollyEngine: AWSPollyEngine;

	// Voice transcription & Text-to-Speech
	speechServerUrl: string;
	whisperServerUrl: string;
	whisperApiKey: string;
	serpApiKey: string;
	ttsEnabled: boolean;
	ttsMode: TTSMode;
	ttsTranscriptionResponse: boolean;
	transcriptionEnabled: boolean;
	transcriptionMode: TranscriptionMode;
	transcriptionLanguage: string;
}

export function createConfig(env: NodeJS.ProcessEnv = process.env): IConfig {
	return {
		whitelistedPhoneNumbers: splitList(env.WHITELISTED_PHONE_NUMBERS),
		whitelistedEnabled: getEnvBooleanWithDefault(env, "WHITELISTED_ENABLED", false),

		openAIAPIKeys: splitList(env.OPENAI_API_KEYS || env.OPENAI_API_KEY),
		openAIModel: env.OPENAI_GPT_MODEL || "gpt-4o-mini",
		openAIImageModel: env.OPENAI_IMAGE_MODEL || "dall-e-2",
		openAIModerationModel: env.OPENAI_MODERATION_MODEL || "omni-moderation-latest",
		openAITranscriptionModel: env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1",
		openAIBaseUrl: env.OPENAI_BASE_URL?.replace(/\/+$/, ""),
		legacyOpenAIApiUrl: env.OPENAI_API_URL,
		maxModelTokens: getEnvMaxModelTokens(env),
		prePrompt: env.PRE_PROMPT,

		prefixEnabled: getEnvBooleanWithDefault(env, "PREFIX_ENABLED", true),
		prefixSkippedForMe: getEnvBooleanWithDefault(env, "PREFIX_SKIPPED_FOR_ME", true),
		gptPrefix: env.GPT_PREFIX || "!gpt",
		dallePrefix: env.DALLE_PREFIX || "!dalle",
		stableDiffusionPrefix: env.STABLE_DIFFUSION_PREFIX || "!sd",
		resetPrefix: env.RESET_PREFIX || "!reset",
		aiConfigPrefix: env.AI_CONFIG_PREFIX || "!config",
		langChainPrefix: env.LANGCHAIN_PREFIX || "!lang",

		groupchatsEnabled: getEnvBooleanWithDefault(env, "GROUPCHATS_ENABLED", false),

		promptModerationEnabled: getEnvBooleanWithDefault(env, "PROMPT_MODERATION_ENABLED", false),
		promptModerationBlacklistedCategories: getEnvPromptModerationBlacklistedCategories(env),

		awsAccessKeyId: env.AWS_ACCESS_KEY_ID || "",
		awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY || "",
		awsRegion: env.AWS_REGION || "",
		awsPollyVoiceId: env.AWS_POLLY_VOICE_ID || "Joanna",
		awsPollyEngine: getEnvAWSPollyVoiceEngine(env),

		speechServerUrl: env.SPEECH_API_URL || "https://speech-service.verlekar.com",
		whisperServerUrl: env.WHISPER_API_URL || "https://transcribe.whisperapi.com",
		whisperApiKey: env.WHISPER_API_KEY || "",
		serpApiKey: env.SERPAPI_API_KEY || "",

		ttsEnabled: getEnvBooleanWithDefault(env, "TTS_ENABLED", false),
		ttsMode: getEnvTTSMode(env),
		ttsTranscriptionResponse: getEnvBooleanWithDefault(env, "TTS_TRANSCRIPTION_RESPONSE_ENABLED", true),

		transcriptionEnabled: getEnvBooleanWithDefault(env, "TRANSCRIPTION_ENABLED", false),
		transcriptionMode: getEnvTranscriptionMode(env),
		transcriptionLanguage: env.TRANSCRIPTION_LANGUAGE || ""
	};
}

export const config = createConfig();

/**
 * Get the max model tokens from the environment variable
 * @returns The max model tokens from the environment variable or 4096
 */
function getEnvMaxModelTokens(env: NodeJS.ProcessEnv): number {
	const envValue = env.MAX_MODEL_TOKENS;
	if (envValue == undefined || envValue == "") {
		return 4096;
	}

	const value = Number.parseInt(envValue, 10);
	return Number.isFinite(value) && value > 0 ? value : 4096;
}

/**
 * Get an environment variable as a boolean with a default value
 * @param key The environment variable key
 * @param defaultValue The default value
 * @returns The value of the environment variable or the default value
 */
function getEnvBooleanWithDefault(env: NodeJS.ProcessEnv, key: string, defaultValue: boolean): boolean {
	const envValue = env[key]?.trim().toLowerCase();
	if (envValue == undefined || envValue == "") {
		return defaultValue;
	}

	return envValue == "true";
}

/**
 * Get the blacklist categories for prompt moderation from the environment variable
 * @returns Blacklisted categories for prompt moderation
 */
function getEnvPromptModerationBlacklistedCategories(env: NodeJS.ProcessEnv): string[] {
	const envValue = env.PROMPT_MODERATION_BLACKLISTED_CATEGORIES;
	if (envValue == undefined || envValue == "") {
		return ["hate", "hate/threatening", "self-harm", "sexual", "sexual/minors", "violence", "violence/graphic"];
	}

	const categories: unknown = JSON.parse(envValue.replace(/'/g, '"'));
	if (!Array.isArray(categories) || !categories.every((category) => typeof category === "string")) {
		throw new Error("PROMPT_MODERATION_BLACKLISTED_CATEGORIES must be a JSON array of strings");
	}
	return categories;
}

/**
 * Get the transcription mode from the environment variable
 * @returns The transcription mode
 */
function getEnvTranscriptionMode(env: NodeJS.ProcessEnv): TranscriptionMode {
	return getEnvEnum(env.TRANSCRIPTION_MODE, Object.values(TranscriptionMode), TranscriptionMode.Local);
}

/**
 * Get the TTS mode from the environment variable
 * @returns The tts mode
 */
function getEnvTTSMode(env: NodeJS.ProcessEnv): TTSMode {
	return getEnvEnum(env.TTS_MODE, Object.values(TTSMode), TTSMode.SpeechAPI);
}

/**
 * Get the AWS Polly voice engine from the environment variable
 * @returns The voice engine
 */
function getEnvAWSPollyVoiceEngine(env: NodeJS.ProcessEnv): AWSPollyEngine {
	return getEnvEnum(env.AWS_POLLY_VOICE_ENGINE, Object.values(AWSPollyEngine), AWSPollyEngine.Standard);
}

function getEnvEnum<T extends string>(value: string | undefined, allowedValues: T[], defaultValue: T): T {
	const normalizedValue = value?.trim().toLowerCase();
	return allowedValues.includes(normalizedValue as T) ? (normalizedValue as T) : defaultValue;
}

function splitList(value: string | undefined): string[] {
	return value
		? value
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean)
		: [];
}

export default config;
