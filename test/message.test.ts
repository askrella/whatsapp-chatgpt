import { describe, expect, it, vi } from "vitest";
import type { Message } from "whatsapp-web.js";
import { handleIncomingMessageSafely } from "../src/handlers/message";
import { printError } from "../src/cli/ui";

vi.mock("../src/cli/ui", () => ({
	print: vi.fn(),
	printError: vi.fn()
}));

describe("safe message handling", () => {
	it("reports handler failures without rejecting the event listener", async () => {
		const message = {
			body: "hello",
			from: "user@example.com",
			getChat: vi.fn().mockRejectedValue(new Error("network unavailable")),
			reply: vi.fn().mockResolvedValue(undefined)
		} as unknown as Message;

		await expect(handleIncomingMessageSafely(message)).resolves.toBeUndefined();
		expect(printError).toHaveBeenCalledWith("Failed to handle message from user@example.com: network unavailable");
		expect(message.reply).toHaveBeenCalledWith("I couldn't process that message. Please try again.");
	});

	it("also contains failures while sending the error reply", async () => {
		const message = {
			body: "hello",
			from: "user@example.com",
			getChat: vi.fn().mockRejectedValue(new Error("network unavailable")),
			reply: vi.fn().mockRejectedValue(new Error("reply unavailable"))
		} as unknown as Message;

		await expect(handleIncomingMessageSafely(message)).resolves.toBeUndefined();
		expect(printError).toHaveBeenCalledWith("Failed to send error reply: reply unavailable");
	});
});
