import config from "../config";

/**
 * @param sentence The sentence to be converted to speech
 * @returns Audio buffer
 */
async function ttsRequest(sentence: string): Promise<Buffer> {
	const url = config.speechServerUrl + "/tts";

	// Request options
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			sentences: [sentence]
		})
	};

	const response = await fetch(url, options);
	const audioBuffer = await response.arrayBuffer();
	return Buffer.from(audioBuffer);
}

/**
 * @param audioBlob The audio blob to be transcribed
 * @returns Response: { text: string, language: string }
 */
async function transcribeRequest(audioBlob: Blob): Promise<{ text: string; language: string }> {
	const url = config.speechServerUrl + "/transcribe";

	// FormData
	const formData = new FormData();
	formData.append("audio", audioBlob);

	// Request options
	const options = {
		method: "POST",
		body: formData
	};

	const response = await fetch(url, options);
	const transcription = await response.json();
	return transcription;
}

export { ttsRequest, transcribeRequest };
