# ChatGPT + Whatsapp = AI Assistant 🚀

Whatsapp bot that uses OpenAI's GPT & DALLE to respond to user inputs.

### GPT Example
![Example](https://i.imgur.com/Za4s6aR.png)

### Dalle Example
![Example](https://i.imgur.com/nqDT4E4.png)

## Requirements

- Node.js
- A recent version of npm
- An OpenAI Account

## .env File example

```
OPENAI_API_KEY=put_your_key_here

PREFIX_ENABLED=false
```

## Installation

1. Clone this repository
2. Install the required packages by running `npm install`
3. Put your OpenAI API Key into the .env File (`OPENAI_API_KEY`)
    - You can obtain an API Key here: [**OpenAI API Keys**](https://platform.openai.com/account/api-keys)
4. Run the bot using `npm run start`
5. Scan the QR Code with Whatsapp (Link a device)
6. Now you're ready to go, people can send you messages and the bot will respond to them.

## Usage

To use the bot, simply send a message with the `!gpt`/`!dalle` command followed by your prompt. For example:

GPT:
- `!gpt What is the meaning of life?`

DALLE:
- `!dalle A frog with a red hat is walking on a bridge.`

## Sending Messages to Yourself

The WhatsApp ChatGPT bot now supports sending messages to yourself using the current authenticated account.
This feature can be useful for various purposes, such as testing and research.

To use this feature, simply send a message to your own phone number using the WhatsApp link `https://wa.me/phone`.
This will take you to your own chat window.

Once you have access to your own chat, you can use the `me<command>` syntax to issue commands to the bot.
For example, to use the DALLE model, send a message with the command `medalle`. To use the GPT model, send a message with the command `megpt`.

### Note

- To use this feature, make sure that you have authenticated your WhatsApp account with the WhatsApp ChatGPT bot.
- When sending messages to yourself, ensure that you are using the same account that is authenticated with the bot.
  Otherwise, you will not receive any response.

## Disable prefix

You can disable the `!gpt` prefix by setting `PREFIX_ENABLED` to `false` in the .env file.

If you disable the prefix, the bot will not support DALLE and only GPT will be used.

## Disclaimer
The operations performed by this bot are not free. You will be charged by OpenAI for each request you make.

## Contributors
- [andrewssobral](https://github.com/andrewssobral) - DALLE integration

## Used libraries
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
