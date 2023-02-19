import process from "process";
import { ChatGPTAPI, ChatMessage } from "chatgpt";
import { type Message } from "whatsapp-web.js";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversations = {};

export const handleMessageGPT = async (message: Message, prompt: string) => {
  try {
    const lastConversation = conversations[message.from];

    console.log(
      "[Whatsapp ChatGPT] Received prompt from " + message.from + ": " + prompt
    );

    const start = Date.now();
    let response: ChatMessage;

    if (lastConversation) {
      response = await api.sendMessage(prompt, lastConversation);
    } else {
      response = await api.sendMessage(prompt);
    }

    const end = Date.now() - start;

    console.log(
      `[Whatsapp ChatGPT] Answer to ${message.from}: ${response.text}  | OpenAI request took ${end}ms)`
    );

    conversations[message.from] = {
      conversationId: response.conversationId,
      parentMessageId: response.id,
    };

    message.reply(response.text);
  } catch (error: any) {
    console.error("An error happened", error);
    message.reply(
      "An error happened, please contact the administrator. (" +
        error.message +
        ")"
    );
  }
};
