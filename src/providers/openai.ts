import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";

import { config } from "../env/env-variables";

// ChatGPT Client (text-davinci-003)
export const chatgpt = new ChatGPTAPI({
	apiKey: config.OPENAI_API_KEY,
	maxModelTokens: config.MAX_MODEL_TOKENS
});

// OpenAI Client (DALL-E)
export const openai = new OpenAIApi(
	new Configuration({
		apiKey: config.OPENAI_API_KEY
	})
);
