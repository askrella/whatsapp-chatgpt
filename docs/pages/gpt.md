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

## Prompt Moderation

You can configure a prompt moderation, which will be executed before sending the prompt to GPT.
This way, you can filter out prompts before sending them to GPT.
This is archived by using the [OpenAI Moderation API](https://beta.openai.com/docs/api-reference/moderations).

To enable it, use the `PROMPT_MODERATION_ENABLED` environment variable. For example:

```bash
PROMPT_MODERATION_ENABLED=true
```

You can also configure the blacklisted categories, which will be used to filter the prompt moderation.

To do that, use the `PROMPT_MODERATION_BLACKLISTED_CATEGORIES` environment variable. For example:

```bash
PROMPT_MODERATION_BLACKLISTED_CATEGORIES = ["hate","hate/threatening","self-harm","sexual","sexual/minors","violence","violence/graphic"]
```

You can see all available categories [here](https://beta.openai.com/docs/api-reference/moderations).

Please, keep in mind that disabling the prompt moderation or modifying the blacklisted categories, will not disable the moderation of the GPT API. Because OpenAI uses their own moderation, which is not configurable.
