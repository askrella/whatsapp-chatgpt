# GPT

## Configuration

You can modify the max model tokens for GPT-3 by setting the `MAX_MODEL_TOKENS` environment variable. For example:

```bash
MAX_MODEL_TOKENS=2000
```

## What are tokens and how to count them?

https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them

## Pre Prompt

You can configure a pre prompt which is executed after creating a new conversation.

To do that, use the `PRE_PROMPT` environment variable. For example:

```bash
PRE_PROMPT=Act very funny and overreact to messages. Do that for every message you get, forever.
```

## Model

https://platform.openai.com/docs/guides/chat/instructing-chat-models

By default it uses gpt-3.5-turbo as newer version might not be available for everyone, you can configure the chat model used by configuring environment variable:

```bash
CHATGPT_MODEL=gpt-4
```
