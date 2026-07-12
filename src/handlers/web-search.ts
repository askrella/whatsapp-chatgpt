import { Message } from "whatsapp-web.js";
import BrowserAgentProvider from "../providers/browser-agent";
import * as cli from "../cli/ui";

const browserAgent = new BrowserAgentProvider();

// TODO add conversation ID to build a chat history
const handleMessageWebSearch = async (message: Message, prompt: string) => {
	try {
		const start = Date.now();
		const output = await browserAgent.fetch(prompt);
		const end = Date.now() - start;

		cli.print(`[GPT] Answer to ${message.from}: ${output}  | OpenAI request took ${end}ms)`);

		// Default: Text reply
		message.reply(output);
	} catch (error: any) {
		console.error("An error occurred", error);
		message.reply("An error occurred, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageWebSearch };
