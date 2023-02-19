import {  Client } from "whatsapp-web.js";

// Whatsapp Client
export const whatsappClient = new Client({
	puppeteer: {
		args: ["--no-sandbox"]
	}
});

