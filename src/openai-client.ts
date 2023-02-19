import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";

export const chatgpt = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);
