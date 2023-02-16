# Whatsapp Chatbot

This project is a whatsapp bot that uses OpenAI's ChatGPT to respond to user inputs.
To use ChatGPT, simply type `!gpt` followed by your prompt, and the bot will generate a response.

![Example](https://i.imgur.com/Za4s6aR.png)

## Requirements

- Node.js
- A recent version of npm
- An OpenAI Account

## .env File example

```
OPENAI_API_KEY=put_your_key_here

PREFIX_ENABLED=true
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

To use the bot, simply send a message with `!gpt` command followed by your prompt. For example:

`!gpt What is the meaning of life?`

The bot only responds to messages that are received by you, not sent.

You can disable the `!gpt` prefix by setting `PREFIX_ENABLED` to `false` in the .env file.

## Used libraries
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
