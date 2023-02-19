import process from "process";
import { Configuration, OpenAIApi } from "openai";

import { MessageMedia } from "whatsapp-web.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const handleMessageDALLE = async (message: any, prompt: any) => {
  try {
    const start = Date.now();
    console.log(
      "[Whatsapp DALLE] Received prompt from " + message.from + ": " + prompt
    );

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    const end = Date.now() - start;

    const base64 = response.data.data[0].b64_json;
    const image = await new MessageMedia("image/jpeg", base64, "image.jpg");

    console.log(
      `[Whatsapp DALLE] Answer to ${message.from} | OpenAI request took ${end}ms`
    );

    message.reply(image);
  } catch (error: any) {
    console.error("An error happened", error);
    message.reply(
      "An error happened, please contact the administrator. (" +
        error.message +
        ")"
    );
  }
};
