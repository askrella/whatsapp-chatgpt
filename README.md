# GPT + DALL-E + Whatsapp = AI Assistant 🚀
![Docker](https://github.com/askrella/whatsapp-chatgpt/actions/workflows/docker.yml/badge.svg)
![Prettier](https://github.com/askrella/whatsapp-chatgpt/actions/workflows/prettier.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This WhatsApp bot uses OpenAI's GPT and DALL-E to respond to user inputs.

<img width="904" alt="Example prompts" src="https://user-images.githubusercontent.com/6507938/219959783-96cac29a-d786-4586-a1fc-4dca827c4344.png">

## Requirements

-   Node.js (18 or newer)
-   A recent version of npm
-   An OpenAI Account

## Installation

1. Clone this repository
2. Install the required packages by running `npm install`
3. Put your OpenAI API key into the `.env` file
   - Example file: [.env-example](https://github.com/askrella/whatsapp-chatgpt/blob/master/.env-example)
   - You can obtain an API key [here](https://platform.openai.com/account/api-keys)
4. Run the bot using `npm run start`
5. Scan the QR code with WhatsApp (link a device)
6. Now you're ready to go! People can send you messages, and the bot will respond to them

## Docker

Make sure to edit the `docker-compose.yml` file and set your own variables there.
```sh
sudo docker-compose up
```

## Usage

To use the bot, simply send a message with the `!gpt`/`!dalle` command followed by your prompt. For example:

GPT:

-   `!gpt What is the meaning of life?`

DALLE:

-   `!dalle A frog with a red hat is walking on a bridge.`

## Disable prefix

You can disable the `!gpt`/`!dalle` prefix by setting `PREFIX_ENABLED` to `false` in the `.env` file.<br/>
If you disable the prefix, the bot will not support DALL-E, and only GPT will be used.

## Sending messages to yourself

This bot also supports sending messages to yourself.

To use this feature, simply send a message to your own phone number using the WhatsApp link `https://wa.me/<your_phone_number>`.
This will take you to your own chat window.

After gaining access to your own chat, you can send a message to yourself and the bot will respond.

## Disclaimer

The operations performed by this bot are not free. You will be charged by OpenAI for each request you make.

## Contributors

<a href="https://github.com/askrella/whatsapp-chatgpt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=askrella/whatsapp-chatgpt" />
</a>

## Used libraries

-   https://github.com/pedroslopez/whatsapp-web.js
-   https://github.com/transitive-bullshit/chatgpt-api
