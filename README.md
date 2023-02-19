<center>

# ChatGPT + DALL-E + WhatsApp = AI Assistant 🚀

This WhatsApp bot uses OpenAI's GPT and DALL-E to respond to user inputs.

[![Join Discord](https://user-images.githubusercontent.com/6507938/219944620-8a1f86f3-2aa8-4f73-8958-28337e1d53bd.png)](https://discord.gg/9VJaRXKwd3)

</center>



## Examples

### GPT
![Example](https://i.imgur.com/Za4s6aR.png)

### DALL-E
![Example](https://i.imgur.com/nqDT4E4.png)

## Requirements

- Node.js
- A recent version of npm
- An OpenAI Account

## Installation

1. Clone this repository.
2. Install the required packages by running `npm install`.
3. Put your OpenAI API key into the `.env` file (`OPENAI_API_KEY`).
   - There's an example file called `.env-example` that you can use.
   - You can obtain an API key [here](https://platform.openai.com/account/api-keys).
4. Run the bot using `npm run start`.
5. Scan the QR code with WhatsApp (link a device).
6. Now you're ready to go! People can send you messages, and the bot will respond to them.

## Docker

``` docker build . -t [image-name] ```

## Usage

To use the bot, simply send a message with the `!gpt` or `!dalle` command followed by your prompt. For example:

- GPT: `!gpt What is the meaning of life?`
- DALL-E: `!dalle A frog with a red hat is walking on a bridge.`

The bot only responds to messages that are received by you, not sent by you.


## Disabling the Prefix

You can disable the `!gpt` prefix by setting `PREFIX_ENABLED` to `false` in the `.env` file. If you disable the prefix, the bot will not support DALL-E, and only GPT will be used.

## Expanding Functionalities

This bot uses the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library, which allows you to extend its functionalities. To do so, you can modify the index.js file, or create a new one, and include any additional features you want.

## Disclaimer

The operations performed by this bot are not free. You will be charged by OpenAI for each request you make.

## Used Libraries

- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api

<center>

## Contributors

<a href="https://github.com/askrella/whatsapp-chatgpt/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=askrella/whatsapp-chatgpt" />
</a>

Made with [contrib.rocks](https://contrib.rocks).
</center>

