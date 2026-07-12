import { describe, expect, it } from "vitest";
import { createConfig } from "../src/config";
import { AWSPollyEngine } from "../src/types/aws-polly-engine";
import { TranscriptionMode } from "../src/types/transcription-mode";
import { TTSMode } from "../src/types/tts-mode";

describe("createConfig", () => {
	it("provides safe modern defaults", () => {
		const config = createConfig({});

		expect(config.openAIModel).toBe("gpt-4o-mini");
		expect(config.openAIImageModel).toBe("dall-e-2");
		expect(config.openAIModerationModel).toBe("omni-moderation-latest");
		expect(config.openAITranscriptionModel).toBe("whisper-1");
		expect(config.maxModelTokens).toBe(4096);
		expect(config.prefixEnabled).toBe(true);
		expect(config.groupchatsEnabled).toBe(false);
		expect(config.awsPollyVoiceId).toBe("Joanna");
		expect(config.transcriptionMode).toBe(TranscriptionMode.Local);
		expect(config.ttsMode).toBe(TTSMode.SpeechAPI);
	});

	it("normalizes configured lists, booleans, numbers, and enums", () => {
		const config = createConfig({
			AWS_POLLY_VOICE_ENGINE: "NEURAL",
			MAX_MODEL_TOKENS: "8000",
			OPENAI_API_KEYS: " first-key, second-key , ,",
			OPENAI_API_URL: "https://legacy.example/transcriptions",
			OPENAI_BASE_URL: "https://example.com/v1/",
			PREFIX_ENABLED: " FALSE ",
			TRANSCRIPTION_MODE: "OPENAI",
			TTS_MODE: "AWS-POLLY",
			WHITELISTED_PHONE_NUMBERS: "123, 456"
		});

		expect(config.openAIAPIKeys).toEqual(["first-key", "second-key"]);
		expect(config.openAIBaseUrl).toBe("https://example.com/v1");
		expect(config.legacyOpenAIApiUrl).toBe("https://legacy.example/transcriptions");
		expect(config.whitelistedPhoneNumbers).toEqual(["123", "456"]);
		expect(config.prefixEnabled).toBe(false);
		expect(config.maxModelTokens).toBe(8000);
		expect(config.transcriptionMode).toBe(TranscriptionMode.OpenAI);
		expect(config.ttsMode).toBe(TTSMode.AWSPolly);
		expect(config.awsPollyEngine).toBe(AWSPollyEngine.Neural);
	});

	it("falls back when numeric or enum values are invalid", () => {
		const config = createConfig({
			AWS_POLLY_VOICE_ENGINE: "invalid",
			MAX_MODEL_TOKENS: "not-a-number",
			TRANSCRIPTION_MODE: "invalid",
			TTS_MODE: "invalid"
		});

		expect(config.maxModelTokens).toBe(4096);
		expect(config.transcriptionMode).toBe(TranscriptionMode.Local);
		expect(config.ttsMode).toBe(TTSMode.SpeechAPI);
		expect(config.awsPollyEngine).toBe(AWSPollyEngine.Standard);
	});

	it("rejects a non-list moderation configuration", () => {
		expect(() => createConfig({ PROMPT_MODERATION_BLACKLISTED_CATEGORIES: '{"hate":true}' })).toThrow(
			"must be a JSON array of strings"
		);
	});
});
