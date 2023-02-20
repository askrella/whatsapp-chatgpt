import { ChatMessage } from "chatgpt";
import { Message } from "whatsapp-web.js";
import { chatgpt } from "./openai";

// Mapping from number to last conversation id
const conversations = {};

// Cache to store frequently asked questions and their responses
const responseCache = new Map();


const handleMessageGPT = async (message: Message, prompt: string) => {
	try {
		// Get last conversation
		const lastConversation = conversations[message.from];

          // Check the cache for the response
        const cachedResponse = responseCache.get(prompt);

        if (cachedResponse) {
            console.log("[Whatsapp ChatGPT] Using cached response for " + prompt);
            // Send the cached response to the chat
            message.reply(cachedResponse);
            return;
        }

		console.log("[Whatsapp ChatGPT] Received prompt from " + message.from + ": " + prompt);

		const start = Date.now();

		// Check if we have a conversation with the user
		let response: ChatMessage;
		if (lastConversation) {
			// Handle message with previous conversation
			response = await chatgpt.sendMessage(prompt, lastConversation);
		} else {
			// Handle message with new conversation
			response = await chatgpt.sendMessage(prompt);
		}

		const end = Date.now() - start;

		console.log(`[Whatsapp ChatGPT] Answer to ${message.from}: ${response.text}  | OpenAI request took ${end}ms)`);

		// Set the conversation
		conversations[message.from] = {
			conversationId: response.conversationId,
			parentMessageId: response.id
		};

        // Add the response to the cache
        responseCache.set(prompt, response.text);

		// Send the response to the chat
		message.reply(response.text);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageGPT };
