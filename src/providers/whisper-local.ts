import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import { randomUUID } from "crypto";

async function transcribeAudioLocal(audioBuffer: Buffer): Promise<{ text: string; language: string }> {
	// Write audio buffer to tempdir
	const tempdir = os.tmpdir();
	const audioPath = path.join(tempdir, randomUUID() + ".wav");
	fs.writeFileSync(audioPath, audioBuffer);

	// Transcribe audio
	const output = execSync(`whisper ${audioPath}`, { encoding: "utf-8" });

	// Delete tmp file
	fs.unlinkSync(audioPath);

	// Delete whisper created tmp files
	const extensions = [".wav.srt", ".wav.txt", ".wav.vtt"];
	for (const extension of extensions) {
		fs.readdirSync(process.cwd()).forEach((file) => {
			if (file.endsWith(extension)) fs.unlinkSync(file);
		});
	}

	// Return parsed text and language
	return {
		text: parseTextAfterTimeFrame(output),
		language: parseDetectedLanguage(output)
	};
}

function parseDetectedLanguage(text) {
	const languageLine = text.split("\n")[1]; // Extract the second line of text
	const languageMatch = languageLine.match(/Detected language:\s(.+)/); // Extract the detected language

	if (languageMatch) {
		return languageMatch[1].trim();
	}

	return null; // Return null if match is not found
}

function parseTextAfterTimeFrame(text) {
	const textMatch = text.match(/\[(\d{2}:\d{2}\.\d{3})\s-->\s(\d{2}:\d{2}\.\d{3})\]\s(.+)/); // Extract the text

	if (textMatch) {
		return textMatch[3].trim();
	}

	return null; // Return null if match is not found
}

export { transcribeAudioLocal };
