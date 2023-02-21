import { intro, spinner, note, outro, text } from "@clack/prompts";
import color from "picocolors";

const s = spinner();

export const print = (text: string) => {
	console.log(color.green("◇") + "  " + text);
};

export const printIntro = () => {
	intro(color.bgCyan(color.white(" Whatsapp ChatGPT & DALL-E ")));
	note("A Whatsapp bot that uses OpenAI's ChatGPT and DALL-E to generate text and images from a prompt.");
	s.start("Starting");
};

export const printQRCode = (qr: string) => {
	s.stop("Client is ready!");
	note(qr, "Scan the QR code below to login to Whatsapp Web.");
	s.start("Waiting for QR code to be scanned");
};

export const printLoading = () => {
	s.stop("Authenticated!");
	s.start("Logging in");
};

export const printAuthenticated = () => {
	s.stop("Session started!");
	s.start("Opening session");
};

export const printAuthenticationFailure = () => {
	s.stop("Authentication failed!");
};

export const printOutro = () => {
	s.stop("Loaded!");
	outro("Whatsapp ChatGPT & DALLE is ready to use.");
};
