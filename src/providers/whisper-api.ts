import config from "../config";

async function transcribeWhisperApi(audioBlob: Blob): Promise<{ text: string; language: string }> {
	const url = config.whisperServerUrl;

	// FormData
	const formData = new FormData();
	formData.append("file", audioBlob);
	formData.append("diarization", "false");
	formData.append("numSpeakers", "1");
	formData.append("fileType", "ogg");
	if (config.transcriptionLanguage) {
		formData.append("language", config.transcriptionLanguage);
	}
	formData.append("task", "transcribe");

	const headers = new Headers();
	headers.append("Authorization", `Bearer ${config.whisperApiKey}`);

	// Request options
	const options = {
		method: "POST",
		body: formData,
		headers
	};

	const response = await fetch(url, options);
	const transcription = await response.json();
	return transcription;
}

export { transcribeWhisperApi };
