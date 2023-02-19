import { handleMessageGPT } from "./gpt";
import { handleMessageDALLE } from "./dalle";
import { Message } from "whatsapp-web.js";

// Prefixes
const envPrefixEnabled = process.env.PREFIX_ENABLED == "true";
const gptPrefix = "!gpt";
const dallePrefix = "!dalle";

export const onMessage = async (
  message: Message,
  prefixEnabled = envPrefixEnabled
) => {
  const messageString = message.body;
  if (messageString.length == 0) return;
  if (message.from == "status@broadcast") return;

  if (prefixEnabled) {
    // GPT (!gpt <prompt>)
    if (messageString.startsWith(gptPrefix)) {
      const prompt = messageString.substring(gptPrefix.length + 1);
      await handleMessageGPT(message, prompt);
      return;
    }

    // DALLE (!dalle <prompt>)
    if (messageString.startsWith(dallePrefix)) {
      const prompt = messageString.substring(dallePrefix.length + 1);
      await handleMessageDALLE(message, prompt);
      return;
    }
  } else {
    // GPT (only <prompt>)
    await handleMessageGPT(message, messageString);
  }
};
