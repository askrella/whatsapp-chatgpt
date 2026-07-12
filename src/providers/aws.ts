import { PollyClient, SynthesizeSpeechCommand, type Engine, type VoiceId } from "@aws-sdk/client-polly";
import config from "../config";

/**
 * @param text The sentence to be converted to speech
 * @returns Audio buffer
 */
async function ttsRequest(text: string): Promise<Buffer | null> {
	const credentials =
		config.awsAccessKeyId && config.awsSecretAccessKey
			? {
					accessKeyId: config.awsAccessKeyId,
					secretAccessKey: config.awsSecretAccessKey
				}
			: undefined;
	const polly = new PollyClient({ credentials, region: config.awsRegion || undefined });

	const command = new SynthesizeSpeechCommand({
		OutputFormat: "mp3",
		Text: text,
		Engine: config.awsPollyEngine as Engine,
		VoiceId: config.awsPollyVoiceId as VoiceId
	});

	try {
		const data = await polly.send(command);
		if (data.AudioStream) {
			return Buffer.from(await data.AudioStream.transformToByteArray());
		}
		return null;
	} catch (error) {
		console.error("An error occurred (TTS request)", error);
		return null;
	} finally {
		polly.destroy();
	}
}

export { ttsRequest };
