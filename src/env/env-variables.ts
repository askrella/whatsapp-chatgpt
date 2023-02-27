import process from "process";
import dotenv from "dotenv";

import { z } from "zod";

dotenv.config();

const environmentVariables = z.object({
	OPENAI_API_KEY: z.string(),
	MAX_MODEL_TOKENS: z.number().default(4096),

	PREFIX_ENABLED: z.boolean().default(true),

	GPT_PREFIX: z.string().default("!gpt"),
	DALLE_PREFIX: z.string().default("!dalle"),
	RESET_PREFIX: z.string().default("!reset"),
	AI_CONFIG_PREFIX: z.string().default("!config"),

	SPEECH_API_URL: z.string().default("https://speech-service.verlekar.com"),

	TRANSCRIPTION_ENABLED: z.boolean().default(true),
	TRANSCRIPTION_MODE: z.enum(["local", "speech-api"]),
	TTS_ENABLED: z.boolean().default(false)
});

/**
 * @type {Record<keyof z.infer<typeof environmentVariables>
 */
const processEnv = {
	// General
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	MAX_MODEL_TOKENS: process.env.MAX_MODEL_TOKENS,

	// Prefix
	PREFIX_ENABLED: process.env.PREFIX_ENABLED,
	GPT_PREFIX: process.env.GPT_PREFIX,
	DALLE_PREFIX: process.env.DALLE_PREFIX,
	RESET_PREFIX: process.env.RESET_PREFIX,
	AI_CONFIG_PREFIX: process.env.AI_CONFIG_PREFIX,

	// Text-to-Speech
	SPEECH_API_URL: process.env.SPEECH_API_URL,

	TRANSCRIPTION_ENABLED: process.env.TRANSCRIPTION_ENABLED,
	TRANSCRIPTION_MODE: process.env.TRANSCRIPTION_MODE,
	TTS_ENABLED: process.env.TTS_ENABLED
};

const parsedEnv = environmentVariables.safeParse(processEnv);

if (parsedEnv.success === false) {
	console.error("🔴 Invalid environment variables:", env.error.flatten().fieldErrors);
	throw new Error(parsedEnv.error.message);
}

const config = parsedEnv.data;

export { config };
