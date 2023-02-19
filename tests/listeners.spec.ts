import { describe, it, expect, vi } from "vitest";
import { Message } from "whatsapp-web.js";

import * as gpt from "../src/gpt";
import * as dalle from "../src/dalle";

import { onMessage } from "../src/events-callbacks";

// Mocked message object
const mockMessage = {
  id: "mock-id" as any,
  body: "test message",
  from: "test@example.com",
  to: "test@example.com",
  fromMe: false,
} as Message;

describe("onMessage", () => {
  it("does not handle message if message body is empty", async () => {
    const mockEmptyMessage: Message = {
      ...mockMessage,
      body: "",
    };
    const spyGPT = vi.spyOn(gpt, "handleMessageGPT");
    const spyDALLE = vi.spyOn(dalle, "handleMessageDALLE");

    spyGPT.mockImplementation(() => Promise.resolve());
    spyDALLE.mockImplementation(() => Promise.resolve());

    await onMessage(mockEmptyMessage);

    expect(spyGPT).not.toHaveBeenCalled();
    expect(spyDALLE).not.toHaveBeenCalled();
  });

  it("does not handle message if message is a status broadcast", async () => {
    const mockStatusMessage: Message = {
      ...mockMessage,
      from: "status@broadcast",
    };
    const spyGPT = vi.spyOn(gpt, "handleMessageGPT");
    const spyDALLE = vi.spyOn(dalle, "handleMessageDALLE");

    spyGPT.mockImplementation(() => Promise.resolve());
    spyDALLE.mockImplementation(() => Promise.resolve());

    await onMessage(mockStatusMessage);

    expect(spyGPT).not.toHaveBeenCalled();
    expect(spyDALLE).not.toHaveBeenCalled();
  });

  describe("when prefix is enabled", () => {
    it("handles GPT message", async () => {
        const mockGPTEMessage: Message = {
            ...mockMessage,
            body: "!gpt test message",
        };

      const spyGPT = vi.spyOn(gpt, "handleMessageGPT");
      const spyDALLE = vi.spyOn(dalle, "handleMessageDALLE");

      spyGPT.mockImplementation(() => Promise.resolve());
      spyDALLE.mockImplementation(() => Promise.resolve());

      await onMessage(mockGPTEMessage, true);

      expect(spyGPT).toHaveBeenCalled();
      expect(spyDALLE).not.toHaveBeenCalled();
    });

    it("handles DALLE message", async () => {
      const mockDALLEMessage: Message = {
        ...mockMessage,
        body: "!dalle test message",
      };

      const spyGPT = vi.spyOn(gpt, "handleMessageGPT");
      const spyDALLE = vi.spyOn(dalle, "handleMessageDALLE");

      spyGPT.mockImplementation(() => Promise.resolve());
      spyDALLE.mockImplementation(() => Promise.resolve());

      await onMessage(mockDALLEMessage, true);

      expect(spyGPT).not.toHaveBeenCalled();
      expect(spyDALLE).toHaveBeenCalled();
    });
  });

  describe("when prefix is disabled", () => {
    it("handles GPT message", async () => {
      const spyGPT = vi.spyOn(gpt, "handleMessageGPT");
      const spyDALLE = vi.spyOn(dalle, "handleMessageDALLE");

      spyGPT.mockImplementation(() => Promise.resolve());
      spyDALLE.mockImplementation(() => Promise.resolve());

      await onMessage(mockMessage, false);

      expect(spyGPT).toHaveBeenCalled();
      expect(spyDALLE).not.toHaveBeenCalled();
    });
  });
});
