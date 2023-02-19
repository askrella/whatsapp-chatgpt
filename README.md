# ChatGPT + DALL-E + Whatsapp = AI Assistant 🚀

Whatsapp bot that uses OpenAI's GPT & DALLE to respond to user inputs.

[![Join Discord](https://user-images.githubusercontent.com/6507938/219944620-8a1f86f3-2aa8-4f73-8958-28337e1d53bd.png)](https://discord.gg/9VJaRXKwd3)

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

## Docker

``` docker build . -t [image-name] ```

## Usage

To use the bot, simply send a message with the `!gpt`/`!dalle` command followed by your prompt. For example:

GPT:
- `!gpt What is the meaning of life?`

DALLE:
- `!dalle A frog with a red hat is walking on a bridge.`

The bot only responds to messages that are received by you, not sent by you.

## Disable prefix

You can disable the `!gpt` prefix by setting `PREFIX_ENABLED` to `false` in the .env file.

If you disable the prefix, the bot will not support DALLE and only GPT will be used.

## Disclaimer
The operations performed by this bot are not free. You will be charged by OpenAI for each request you make.

## Contributors
- [andrewssobral](https://github.com/andrewssobral) - DALLE integration
- [RG7279805](https://github.com/RG7279805) - Docker support

## Used libraries
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
