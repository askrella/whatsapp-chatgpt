import color from "picocolors";

export const print = (text: string) => {
	console.log(color.green("◇") + "  " + text);
};

export const printError = (text: string) => {
	console.log(color.red("◇") + "  " + text);
};

export const printIntro = () => {
	console.log("");
	console.log(color.bgCyan(color.white(" Whatsapp ChatGPT & DALL-E ")));
	console.log("|-------------------------------------------------------------------------------------------------|");
	console.log("| A Whatsapp bot that uses OpenAI's ChatGPT and DALL-E to generate text and images from a prompt. |");
	console.log("|-------------------------------------------------------------------------------------------------|");
	console.log("");
};

export const printQRCode = (qr: string) => {
	console.log(qr);
	console.log("Scan the QR code above to login to Whatsapp Web...");
};

export const printLoading = () => {
	console.log("Loading...");
};

export const printAuthenticated = () => {
	console.log("Authenticated, session started!");
};

export const printAuthenticationFailure = () => {
	console.log("Authentication failed!");
};

export const printOutro = () => {
	console.log("");
	console.log("The bot is ready to use.");
	console.log("To get started, send a message to the bot with the prompt you want to use.");
	console.log("Use the prefix '!gpt' if configured that way.");
};
