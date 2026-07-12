import { describe, expect, it } from "vitest";
import { parseDetectedLanguage, parseTextAfterTimeFrame } from "../src/providers/whisper-local";

describe("local Whisper output parsing", () => {
	it("extracts the detected language and transcribed text", () => {
		const output = [
			"Detecting language using up to the first 30 seconds.",
			"Detected language: English",
			"[00:00.000 --> 00:02.500]  Hello from WhatsApp"
		].join("\n");

		expect(parseDetectedLanguage(output)).toBe("English");
		expect(parseTextAfterTimeFrame(output)).toBe("Hello from WhatsApp");
	});

	it("returns empty strings for unrecognized output", () => {
		expect(parseDetectedLanguage("unexpected")).toBe("");
		expect(parseTextAfterTimeFrame("unexpected")).toBe("");
	});
});
