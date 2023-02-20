import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";
import config from "../config";

// ChatGPT Client (text-davinci-003)
export const chatgpt = new ChatGPTAPI({
	apiKey: config.openAIAPIKey
});

// OpenAI Client (DALL-E)
export const openai = new OpenAIApi(
	new Configuration({
		apiKey: config.openAIAPIKey
	})
);
