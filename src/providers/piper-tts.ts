import { execSync } from "child_process";
import config from "../config";

async function ttsRun(text: string, tempFilePath: string): Promise<void> {
	const modelFile = config.piperTTSModel;
	const command = config.piperTTSCommand;
	try {
		execSync(
			`echo "${text}" | ${command} -m ${modelFile} --output-raw | ffmpeg -f s16le -ar 22050 -i pipe: -y -c:a libopus -b:a 17k ${tempFilePath}`
		);
		return;
	} catch (error) {
		console.error("An error occurred (TTS request)", error);
	}
}

export { ttsRun };
