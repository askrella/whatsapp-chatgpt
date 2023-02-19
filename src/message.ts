import process from "process";
import { type Message } from "whatsapp-web.js";

import { handleMessageGPT } from "./gpt";
import { handleMessageDALLE } from "./dalle";

const prefixDisabled = process.env.PREFIX_ENABLED !== "true";
const gptPrefix = "!gpt";
const dallePrefix = "!dalle";

console.log("[Whatsapp ChatGPT] Prefix disabled: " + prefixDisabled);
console.log("[Whatsapp ChatGPT] GPT prefix: " + gptPrefix);
console.log("[Whatsapp ChatGPT] DALL-e prefix: " + dallePrefix);

export const handleMessage = async (message: Message) => {
  if (message.from.match(/status\@broadcast/gi)) return;

  const messageString = message.body;
  if (messageString.length == 0) return;

  if (prefixDisabled) {
    await handleMessageGPT(message, messageString);
    return;
  }

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
};
