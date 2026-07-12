import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { randomUUID } from "crypto";
import { promisify } from "util";
import config from "../config";
import { getConfig } from "../handlers/ai-config";

const execFileAsync = promisify(execFile);

let aiProviderPromise: ReturnType<typeof createAIProvider> | undefined;
let apiKey: string | undefined;

export type ChatHistoryMessage = { role: "user"; content: string } | { role: "assistant"; content: string };

export async function initAI(): Promise<void> {
	if (config.legacyOpenAIApiUrl) {
		throw new Error(
			"OPENAI_API_URL is no longer supported. Remove it or replace it with an OPENAI_BASE_URL that supports every required API."
		);
	}
	apiKey = getConfig("gpt", "apiKey");
	if (!apiKey) {
		throw new Error("No OpenAI API key configured. Set OPENAI_API_KEY or OPENAI_API_KEYS.");
	}
	aiProviderPromise = createAIProvider(apiKey);
	await aiProviderPromise;
}

async function getAIProvider() {
	if (!aiProviderPromise) {
		throw new Error("AI provider has not been initialized");
	}
	return aiProviderPromise;
}

async function createAIProvider(providerApiKey: string) {
	const { createOpenAI } = await import("@ai-sdk/openai");
	return createOpenAI({ apiKey: providerApiKey, baseURL: config.openAIBaseUrl });
}

export async function sendChatMessage(prompt: string, history: ChatHistoryMessage[] = []) {
	const { generateText } = await import("ai");
	const provider = await getAIProvider();
	const messages: ChatHistoryMessage[] = [...history, { role: "user", content: prompt }];
	const response = await generateText({
		model: provider(config.openAIModel),
		messages,
		instructions: config.prePrompt,
		maxOutputTokens: getConfig("gpt", "maxModelTokens"),
		temperature: 0.7,
		providerOptions: {
			openai: {
				store: false
			}
		}
	});

	return {
		id: response.response.id,
		text: response.text
	};
}

export async function runAIWebSearch(query: string, searchWeb: (query: string) => Promise<unknown>): Promise<string> {
	const [{ generateText, isStepCount, tool }, { z }] = await Promise.all([import("ai"), import("zod")]);
	const provider = await getAIProvider();
	const response = await generateText({
		model: provider(config.openAIModel),
		prompt: query,
		instructions:
			"Answer the user's query using web search. Search again when results are incomplete or ambiguous. Be concise and mention source URLs.",
		maxOutputTokens: getConfig("gpt", "maxModelTokens"),
		temperature: 0,
		tools: {
			searchWeb: tool({
				description: "Search Google for current information",
				inputSchema: z.object({ query: z.string().min(1) }),
				execute: async ({ query: searchQuery }) => searchWeb(searchQuery)
			})
		},
		stopWhen: isStepCount(5),
		providerOptions: {
			openai: {
				store: false
			}
		}
	});

	return response.text;
}

export async function generateAIImage(prompt: string, size: `${number}x${number}`) {
	const { generateImage } = await import("ai");
	const provider = await getAIProvider();
	const { image } = await generateImage({
		model: provider.image(config.openAIImageModel),
		prompt,
		size
	});

	return {
		base64: image.base64,
		mediaType: image.mediaType
	};
}

export async function moderatePrompt(prompt: string): Promise<Record<string, boolean>> {
	if (!apiKey) {
		throw new Error("AI provider has not been initialized");
	}

	const response = await fetch(`${config.openAIBaseUrl || "https://api.openai.com/v1"}/moderations`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ input: prompt, model: config.openAIModerationModel })
	});

	if (!response.ok) {
		throw new Error(`OpenAI moderation failed (${response.status}): ${await response.text()}`);
	}

	const result = (await response.json()) as { results?: Array<{ categories?: Record<string, boolean> }> };
	const categories = result.results?.[0]?.categories;
	if (!categories) {
		throw new Error("OpenAI moderation returned no categories");
	}
	return categories;
}

export async function transcribeAudioWithAI(audioBuffer: Buffer): Promise<{ text: string; language: string }> {
	const tempdir = os.tmpdir();
	const oggPath = path.join(tempdir, randomUUID() + ".ogg");
	const wavPath = path.join(tempdir, randomUUID() + ".wav");
	fs.writeFileSync(oggPath, audioBuffer);

	try {
		await convertOggToWav(oggPath, wavPath);
		return await transcribeWavWithAI(fs.readFileSync(wavPath));
	} catch (error) {
		console.error("An error occurred (AI transcription)", error);
		return { text: "", language: config.transcriptionLanguage };
	} finally {
		fs.rmSync(oggPath, { force: true });
		fs.rmSync(wavPath, { force: true });
	}
}

export async function transcribeWavWithAI(wavBuffer: Buffer): Promise<{ text: string; language: string }> {
	const { transcribe } = await import("ai");
	const provider = await getAIProvider();
	const result = await transcribe({
		model: provider.transcription(config.openAITranscriptionModel),
		audio: wavBuffer,
		providerOptions: {
			openai: {
				language: config.transcriptionLanguage || undefined
			}
		}
	});

	return {
		text: result.text,
		language: result.language || config.transcriptionLanguage
	};
}

async function convertOggToWav(oggPath: string, wavPath: string): Promise<void> {
	await execFileAsync("ffmpeg", ["-y", "-i", oggPath, "-acodec", "pcm_s16le", wavPath]);
}
