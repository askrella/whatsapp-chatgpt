# GPT

Text, image, and transcription requests use [Vercel AI SDK](https://ai-sdk.dev/) with its OpenAI provider.

## Model

You can specify the model with the `OPENAI_GPT_MODEL` environment variable. The default is `gpt-4o-mini`.

```bash
OPENAI_GPT_MODEL=gpt-4o-mini
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

For key rotation, provide a comma-separated pool in `OPENAI_API_KEYS`. One key is selected whenever the OpenAI client is initialized.
