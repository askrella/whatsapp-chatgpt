# GPT

## Model

You can specify the model which should be used with the `OPENAI_MODEL` environment variabl

```bash
OPENAI_MODEL=gpt-3.5-turbo # or gpt-4
```

## Configuration

You can modify the max model tokens by setting the `MAX_MODEL_TOKENS` environment variable. For example:

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

## Groupchats

You can enable the bot to interact on groupchats by setting the `GROUPCHATS_ENABLED` environment variable to `true`. For example:

```bash
GROUPCHATS_ENABLED=true
```

## Prompt Moderation

You can configure a prompt moderation, which will be executed before sending the prompt to GPT.
This way, you can filter out prompts before sending them to GPT.
This is achieved by using the [OpenAI Moderation API](https://beta.openai.com/docs/api-reference/moderations).

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

## Rate Limit

https://platform.openai.com/docs/guides/rate-limits

If you are with heavy usage, you might run into the rate limit of Open API. Since the rate limit is on organization level, you could create another account and get a new API key separately. And then setting the keys into environment variables `OPENAI_API_KEYS`. API keys will be used in a random basis.
