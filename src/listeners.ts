import qrcode from "qrcode-terminal";
import { type Message } from "whatsapp-web.js";

import { handleMessage } from "./message";

export const onQRCode = (qrCode: string) => {
  console.log("[Whatsapp ChatGPT] Scan this QR code in whatsapp to log in:");
  qrcode.generate(qrCode, { small: true }, null);
};

export const onAuthenticated = () => {
  console.log("[Whatsapp ChatGPT] Client authenticated");
};

export const onReady = () => {
  console.log("[Whatsapp ChatGPT] Client is ready!");
};

export const onMessage = async (message: Message) => {
  console.log(
    "[Whatsapp ChatGPT] Received message from " +
      message.from +
      ": " +
      message.body
  );
  return handleMessage(message);
};

export const onMessageCreate = (message: Message) => {
  if (!message.fromMe) return;

  console.log(
    "[Whatsapp ChatGPT] Sent message to " + message.to + ": " + message.body
  );
  return handleMessage(message);
};
