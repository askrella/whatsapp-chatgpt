import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Message } from "whatsapp-web.js";
import { handleDeleteConversation, handleMessageGPT } from "../src/handlers/gpt";
import { sendChatMessage } from "../src/providers/ai";

vi.mock("../src/providers/ai", () => ({
	sendChatMessage: vi.fn()
}));

vi.mock("../src/handlers/ai-config", () => ({
	getConfig: vi.fn(() => false)
}));

vi.mock("../src/cli/ui", () => ({
	print: vi.fn()
}));

const mockedSendChatMessage = vi.mocked(sendChatMessage);

function createMessage(from: string) {
	return {
		from,
		reply: vi.fn()
	} as unknown as Message;
}

describe("GPT conversation handling", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("sends the original prompt and chains subsequent responses", async () => {
		const message = createMessage("conversation@example.com");
		mockedSendChatMessage
			.mockResolvedValueOnce({ id: "response-1", text: "First answer" })
			.mockResolvedValueOnce({ id: "response-2", text: "Second answer" });

		await handleMessageGPT(message, "First question");
		await handleMessageGPT(message, "Follow-up question");

		expect(mockedSendChatMessage).toHaveBeenNthCalledWith(1, "First question", []);
		expect(mockedSendChatMessage).toHaveBeenNthCalledWith(2, "Follow-up question", [
			{ role: "user", content: "First question" },
			{ role: "assistant", content: "First answer" }
		]);
		expect(message.reply).toHaveBeenNthCalledWith(1, "First answer");
		expect(message.reply).toHaveBeenNthCalledWith(2, "Second answer");
	});

	it("clears the saved response context", async () => {
		const message = createMessage("reset@example.com");
		mockedSendChatMessage
			.mockResolvedValueOnce({ id: "response-1", text: "First answer" })
			.mockResolvedValueOnce({ id: "response-2", text: "Fresh answer" });

		await handleMessageGPT(message, "First question");
		await handleDeleteConversation(message);
		await handleMessageGPT(message, "Start again");

		expect(mockedSendChatMessage).toHaveBeenLastCalledWith("Start again", []);
		expect(message.reply).toHaveBeenCalledWith("Conversation context was reset!");
	});

	it("bounds locally retained conversation history", async () => {
		const message = createMessage("long-conversation@example.com");
		mockedSendChatMessage.mockImplementation(async (prompt) => ({ id: prompt, text: `Answer to ${prompt}` }));

		for (let index = 1; index <= 12; index++) {
			await handleMessageGPT(message, `Question ${index}`);
		}

		const lastHistory = mockedSendChatMessage.mock.calls.at(-1)?.[1];
		expect(lastHistory).toHaveLength(20);
		expect(lastHistory?.[0]).toEqual({ role: "user", content: "Question 2" });
	});
});
