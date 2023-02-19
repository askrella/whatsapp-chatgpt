import dotenv from "dotenv";
import { Client, LocalAuth } from "whatsapp-web.js";

import {
  onMessage,
  onReady,
  onQRCode,
  onAuthenticated,
  onMessageCreate,
} from "./listeners";

dotenv.config();

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

const start = async () => {
  client.on("qr", onQRCode);
  client.on("authenticated", onAuthenticated);
  client.on("ready", onReady);

  client.on("message", onMessage);
  client.on("message_create", onMessageCreate);

  return client.initialize();
};

try {
  await start();
  console.log("[Whatsapp ChatGPT] Running");
} catch (error: any) {
  console.error("An error happened:", error);
}
