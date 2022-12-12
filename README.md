# Whatsapp Chatbot

This project is a whatsapp bot that uses OpenAI's ChatGPT to respond to user inputs. To use ChatGPT, simply type `!gpt` followed by your prompt, and the bot will generate a response.

## Requirements

- Node.js
- A recent version of npm
- A valid OpenAI session token
- A valid OpenAI clearance token

## .env File example

```
SESSION_TOKEN=your_session_token
CLEARANCE_TOKEN=your_clearance_token
PREFIX_ENABLED=true
```

## Installation

1. Clone this repository
2. Install the required packages by running `npm install`
3. Obtain a valid OpenAI session token and add it to the `.env` file (SESSION_TOKEN)
4. Obtain a valid clearance token and add it to the `.env` file (CLEARANCE_TOKEN)
5. Run the bot using `npm run start`

## How to obtain session token & clearance token

- Session token: https://github.com/transitive-bullshit/chatgpt-api#session-tokens
- Clearance token: https://github.com/transitive-bullshit/chatgpt-api/issues/96#issuecomment-1345694700

## Usage

To use the bot, simply send a message with `!gpt` command followed by your prompt. For example:

`!gpt What is the meaning of life?`

The bot only responds to messages that are received by you, not sent.

## Used libraries
- https://github.com/pedroslopez/whatsapp-web.js
- https://github.com/transitive-bullshit/chatgpt-api
