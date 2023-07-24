import { randomUUID } from "crypto";
import { Message } from "whatsapp-web.js";
import { chatgpt } from "../providers/openai";
import { extractJsonFromMixedString } from '../utils'
import * as cli from "../cli/ui";

// Mapping from number to last conversation id
const conversations = {};

const checkAction = async (message: Message, prompt: string) => {
	try {
		// Get last conversation
		const lastConversationId = conversations[message.from];

		cli.print(`[CHECK ACTION] Checking action from ${message.from}`);

		const start = Date.now();

		// Check if we have a conversation with the user
		let response: string;
		const checkActionPrompt = `
        Check if the prompt bellow is one of valid actions, return it's key (image or gpt) for which it is:
        - image: a prompt asking for image generation
        - gpt: a prompt asking a general question to be answered by a gpt
        Example:
        Prompt: Create an image of a bear wearing a red jacket
        Answer: image
        Prompt: What's the capital of france
        Answer: gpt
        Please generate a JSON file based on this template:
        {
            "action": {{ key }}
        }
		When interpreting the prompt, take into account that it was transcribed from an audio, and may have mistakes, so ajust the verbs, for example:
		- "criei, criou, crio" could be "crie" which means an image command.

		This is the prompt:
        ${prompt}
        `
		if (lastConversationId) {
			// Handle message with previous conversation
			response = await chatgpt.ask(checkActionPrompt, lastConversationId);
		} else {
			// Create new conversation
			const convId = randomUUID();
			const conv = chatgpt.addConversation(convId);

			// Set conversation
			conversations[message.from] = conv.id;

			cli.print(`[GPT] New conversation for ${message.from} (ID: ${conv.id})`);

			// Handle message with new conversation
			response = await chatgpt.ask(checkActionPrompt, conv.id);
		}

		const end = Date.now() - start;

		cli.print(`[GPT] Answer to ${message.from}: ${response}  | OpenAI request took ${end}ms)`);
		const parsed = extractJsonFromMixedString(response)
		console.log('PARSED', parsed)
		return parsed.action
	} catch (error: any) {
		console.error("An error occured", error);
		return false;
	}
};

export { checkAction };
