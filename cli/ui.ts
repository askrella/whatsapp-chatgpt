import { intro, spinner, note, outro } from "@clack/prompts";
import color from 'picocolors'

const s = spinner();

export const printIntro = () => {
    intro(color.bgCyan(color.white(" Whatsapp ChatGPT & DALLE ")));
    note('A Whatsapp bot that uses OpenAI\'s ChatGPT and DALLE to generate text and images from a prompt.')
    s.start("Starting");
}

export const printQRCode = (qr: string) => {
    s.stop('Client is ready!');
    note(qr, "Scan the QR code above to login to Whatsapp Web.");
    s.start('Waiting for QR code to be scanned');
}

export const printLoading = () => {
    s.stop('Authenticated!');
    s.start('Logging in');
}

export const printOutro = () => {
    s.stop('Loaded!');
    outro("Whatsapp ChatGPT & DALLE is ready to use.");
}
