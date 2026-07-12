import qrcode from "qrcode";
import { Client, Message, Events, LocalAuth } from "whatsapp-web.js";

// Constants
import constants from "./constants";

// CLI
import * as cli from "./cli/ui";
import { handleIncomingMessageSafely } from "./handlers/message";

// Config
import { initAiConfig } from "./handlers/ai-config";
import { initAI } from "./providers/ai";
import { setBotReadyTimestamp } from "./runtime-state";

// Entrypoint
const start = async () => {
	cli.printIntro();
	initAiConfig();
	await initAI();

	// WhatsApp Client
	const client = new Client({
		puppeteer: {
			args: ["--disable-dev-shm-usage", "--no-sandbox"],
			executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
		},
		authStrategy: new LocalAuth({
			dataPath: constants.sessionPath
		}),
		webVersionCache: {
			type: "local",
			path: `${constants.sessionPath}/session/web-cache`
		}
	});

	// WhatsApp auth
	client.on(Events.QR_RECEIVED, (qr: string) => {
		console.log("");
		qrcode.toString(
			qr,
			{
				type: "terminal",
				small: true,
				margin: 2,
				scale: 1
			},
			(err, url) => {
				if (err) throw err;
				cli.printQRCode(url);
			}
		);
	});

	// WhatsApp loading
	client.on(Events.LOADING_SCREEN, (percent) => {
		if (percent === "0") {
			cli.printLoading();
		}
	});

	// WhatsApp authenticated
	client.on(Events.AUTHENTICATED, () => {
		cli.printAuthenticated();
	});

	// WhatsApp authentication failure
	client.on(Events.AUTHENTICATION_FAILURE, () => {
		cli.printAuthenticationFailure();
	});

	// WhatsApp ready
	client.on(Events.READY, () => {
		// Print outro
		cli.printOutro();

		// Set bot ready timestamp
		setBotReadyTimestamp(new Date());
	});

	// WhatsApp message
	client.on(Events.MESSAGE_RECEIVED, (message: Message) => {
		// Ignore if message is from status broadcast
		if (message.from == constants.statusBroadcast) return;

		// Ignore if it's a quoted message, (e.g. Bot reply)
		if (message.hasQuotedMsg) return;

		void handleIncomingMessageSafely(message);
	});

	// Reply to own message
	client.on(Events.MESSAGE_CREATE, (message: Message) => {
		// Ignore if message is from status broadcast
		if (message.from == constants.statusBroadcast) return;

		// Ignore if it's a quoted message, (e.g. Bot reply)
		if (message.hasQuotedMsg) return;

		// Ignore if it's not from me
		if (!message.fromMe) return;

		void handleIncomingMessageSafely(message);
	});

	// WhatsApp initialization
	await client.initialize();
};

void start().catch((error) => {
	cli.printError(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
});
