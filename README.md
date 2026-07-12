# GPT + DALL-E + WhatsApp = AI Assistant 🚀

This project is unmaintained, looking for maintainers!

![Docker](https://github.com/askrella/whatsapp-chatgpt/actions/workflows/docker.yml/badge.svg)
![Prettier](https://github.com/askrella/whatsapp-chatgpt/actions/workflows/prettier.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This WhatsApp bot uses OpenAI's GPT and DALL-E 2 to respond to user inputs.

AI features use [Vercel AI SDK](https://ai-sdk.dev/) with the OpenAI provider.

You can talk to the bot in voice messages, the bot will transcribe and respond. :robot:

<p align="center">
<img width="904" alt="Whatsapp ChatGPT" src="https://user-images.githubusercontent.com/6507938/220681521-17a12a41-44df-4d51-b491-f6a83871fc9e.png">
</p>

## Requirements

- Node.js (22 or newer)
- A recent version of npm
- FFmpeg (required for OpenAI voice transcription)
- An [OpenAI API key](https://beta.openai.com/signup)
- A WhatsApp account

## Documentation

In the documentation you can find more information about how to install, configure and use this bot.

<span style="font-size: 1.4rem;">➡️ https://askrella.github.io/whatsapp-chatgpt</span>

## Development

```bash
npm install
npm test
npm run check
npm start
```

`npm start` builds the TypeScript project before launching it. Use `npm run dev` while developing.

## Disclaimer

The operations performed by this bot are not free. You will be charged by OpenAI for each request you make.

This bot uses Puppeteer to run a real instance of Whatsapp Web to avoid getting blocked.

NOTE: We can't guarantee that you won't be blocked using this method, although it does work. WhatsApp does not allow bots or unofficial clients on its platform, so this should not be considered completely safe.

## Contributors

<a href="https://github.com/askrella/whatsapp-chatgpt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=askrella/whatsapp-chatgpt" />
</a>

## Used libraries

- https://github.com/vercel/ai
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/askrella/speech-rest-api
