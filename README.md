# Whatsapp Chatbot

This project is a whatsapp bot that uses OpenAI's ChatGPT to respond to user inputs. To use ChatGPT, simply type `!gpt` followed by your prompt, and the bot will generate a response.

You can also disable the `!gpt` Prefix and send all messages to ChatGPT instantly.

## Requirements

- Node.js
- A recent version of npm
- An OpenAI Account

## .env File example

```
EMAIL=your_email
PASSWORD=your_password

PREFIX_ENABLED=true
```

## Installation

1. Clone this repository
2. Install the required packages by running `npm install`
3. Put your Email and Password into the .env File (`EMAIL`, `PASSWORD`)
4. Run the bot using `npm run start`
5. A browser opens, complete the captcha and click login

## Usage

To use the bot, simply send a message with `!gpt` command followed by your prompt. For example:

`!gpt What is the meaning of life?`

The bot only responds to messages that are received by you, not sent.

## Used libraries
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
