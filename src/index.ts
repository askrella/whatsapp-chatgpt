// Whatsapp client
import { Client, LocalAuth } from "whatsapp-web.js";

import {
  onMessage,
  onReady,
  onQRCode,
  onAuthenticated,
  onMessageCreate,
} from "./listeners";

// Environment variables
require("dotenv").config();

// Whatsapp Client
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
  },
  authStrategy: new LocalAuth(),
});

// Entrypoint
const start = async () => {
  client.on("qr", onQRCode);
  client.on("authenticated", onAuthenticated);
  client.on("ready", onReady);

  client.on("message", onMessage);
  client.on("message_create", onMessageCreate);

  // Whatsapp initialization
  return client.initialize();
};

start()
  .then(() => {
    console.log("[Whatsapp ChatGPT] Running");
  })
  .catch((error: any) => {
    console.error("An error happened:", error);
  });
