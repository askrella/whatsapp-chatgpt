import { describe, expect, it } from "vitest";
import { extractCommandPrompt, startsWithIgnoreCase } from "../src/utils";

describe("startsWithIgnoreCase", () => {
	it("matches prefixes without case sensitivity", () => {
		expect(startsWithIgnoreCase("!GPT hello", "!gpt")).toBe(true);
		expect(startsWithIgnoreCase("hello", "!gpt")).toBe(false);
	});
});

describe("extractCommandPrompt", () => {
	it("extracts and trims a command prompt", () => {
		expect(extractCommandPrompt("!GPT   explain this ", "!gpt")).toBe("explain this");
		expect(extractCommandPrompt("!gpt", "!gpt")).toBe("");
	});

	it("does not match a longer lookalike command", () => {
		expect(extractCommandPrompt("!gptfoo hello", "!gpt")).toBeNull();
		expect(extractCommandPrompt("hello !gpt", "!gpt")).toBeNull();
	});
});
