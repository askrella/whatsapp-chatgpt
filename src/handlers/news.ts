import { Message } from "whatsapp-web.js";
import * as cli from "../cli/ui";
import config from "../config";
import Parser from 'rss-parser';

// Init parser from rss-parser
let parser = new Parser();

const handleMessageNEWS = async (message: Message, prompt: string) => {
	try {
		cli.print(`[RSS-NEWS] Received prompt from ${message.from}: ${prompt}`);
	
		let feed = await parser.parseURL(config.newsRSSURL);
		message.reply(feed.title);

		let counter = 0;
		feed.items.forEach(item => {
			if (config.maxRSSItems != counter) {
				message.reply(item.title + ': ' + item.link);
				counter++;
			} else {
				return;
			}
		});

		cli.print(`[RSS-NEWS] Answer to ${message.from}`);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageNEWS };
