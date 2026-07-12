import { beforeEach, describe, expect, it, vi } from "vitest";
import config from "../src/config";
import { generateAIImage, initAI, moderatePrompt, runAIWebSearch, sendChatMessage, transcribeWavWithAI } from "../src/providers/ai";

const mocks = vi.hoisted(() => {
	const languageModel = { type: "language-model" };
	const imageModel = { type: "image-model" };
	const transcriptionModel = { type: "transcription-model" };
	const provider = Object.assign(
		vi.fn(() => languageModel),
		{
			image: vi.fn(() => imageModel),
			transcription: vi.fn(() => transcriptionModel)
		}
	);

	return {
		createOpenAI: vi.fn(() => provider),
		generateImage: vi.fn(),
		generateText: vi.fn(),
		isStepCount: vi.fn((count: number) => ({ count })),
		tool: vi.fn((definition) => definition),
		transcribe: vi.fn(),
		provider
	};
});

vi.mock("@ai-sdk/openai", () => ({
	createOpenAI: mocks.createOpenAI
}));

vi.mock("ai", () => ({
	generateImage: mocks.generateImage,
	generateText: mocks.generateText,
	isStepCount: mocks.isStepCount,
	tool: mocks.tool,
	transcribe: mocks.transcribe
}));

vi.mock("../src/handlers/ai-config", () => ({
	getConfig: vi.fn((_target: string, type: string) => (type === "apiKey" ? "test-key" : 2048))
}));

describe("AI SDK provider", () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		config.legacyOpenAIApiUrl = undefined;
		await initAI();
	});

	it("generates private chat responses with local history", async () => {
		mocks.generateText.mockResolvedValue({ text: "Answer", response: { id: "response-id" } });

		const result = await sendChatMessage("Follow up", [{ role: "assistant", content: "Previous answer" }]);

		expect(mocks.createOpenAI).toHaveBeenCalledWith({ apiKey: "test-key", baseURL: undefined });
		expect(mocks.provider).toHaveBeenCalledWith("gpt-4o-mini");
		expect(mocks.generateText).toHaveBeenCalledWith(
			expect.objectContaining({
				maxOutputTokens: 2048,
				messages: [
					{ role: "assistant", content: "Previous answer" },
					{ role: "user", content: "Follow up" }
				],
				providerOptions: { openai: { store: false } }
			})
		);
		expect(result).toEqual({ id: "response-id", text: "Answer" });
	});

	it("uses the configured image model through generateImage", async () => {
		mocks.generateImage.mockResolvedValue({ image: { base64: "image-data", mediaType: "image/png" } });

		await expect(generateAIImage("A tiny robot", "512x512")).resolves.toEqual({
			base64: "image-data",
			mediaType: "image/png"
		});
		expect(mocks.provider.image).toHaveBeenCalledWith("dall-e-2");
		expect(mocks.generateImage).toHaveBeenCalledWith(expect.objectContaining({ prompt: "A tiny robot", size: "512x512" }));
	});

	it("transcribes audio through the AI SDK model", async () => {
		mocks.transcribe.mockResolvedValue({ text: "Hello", language: "en" });

		await expect(transcribeWavWithAI(Buffer.from("wav-data"))).resolves.toEqual({ text: "Hello", language: "en" });
		expect(mocks.provider.transcription).toHaveBeenCalledWith("whisper-1");
		expect(mocks.transcribe).toHaveBeenCalledWith(
			expect.objectContaining({
				audio: Buffer.from("wav-data"),
				providerOptions: { openai: { language: undefined } }
			})
		);
	});

	it("provides an iterative AI SDK web-search tool", async () => {
		mocks.generateText.mockResolvedValue({ text: "Current answer" });
		const search = vi.fn().mockResolvedValue({ organicResults: [] });

		await expect(runAIWebSearch("latest result", search)).resolves.toBe("Current answer");
		const searchTool = mocks.generateText.mock.calls[0][0].tools.searchWeb;
		await expect(searchTool.execute({ query: "refined query" })).resolves.toEqual({ organicResults: [] });
		expect(search).toHaveBeenCalledWith("refined query");
		expect(mocks.isStepCount).toHaveBeenCalledWith(5);
	});

	it("rejects the legacy transcription endpoint instead of rerouting audio", async () => {
		config.legacyOpenAIApiUrl = "https://legacy.example/transcriptions";

		await expect(initAI()).rejects.toThrow("OPENAI_API_URL is no longer supported");
	});

	it("keeps moderation on the dedicated endpoint", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ results: [{ categories: { hate: false } }] }), {
				status: 200,
				headers: { "Content-Type": "application/json" }
			})
		);
		vi.stubGlobal("fetch", fetchMock);

		await expect(moderatePrompt("hello")).resolves.toEqual({ hate: false });
		expect(fetchMock).toHaveBeenCalledWith(
			"https://api.openai.com/v1/moderations",
			expect.objectContaining({
				headers: {
					Authorization: "Bearer test-key",
					"Content-Type": "application/json"
				}
			})
		);

		vi.unstubAllGlobals();
	});
});
