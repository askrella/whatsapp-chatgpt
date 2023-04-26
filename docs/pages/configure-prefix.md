# Configure Prefix

## Disable prefix

You can disable the `!gpt`/`!dalle`/`!sd`/`!config` prefix by setting `PREFIX_ENABLED` to `false` in the `.env` file.<br/>

If you disable the prefix, the bot will not support DALL-E and Stable Diffusion, only GPT will be used.

## Set own prefixes

You can set your own prefixes for ChatGPT, DALL-E and configuration in the `.env` file.

```
GPT_PREFIX=!gpt
DALLE_PREFIX=!dalle
STABLE_DIFFUSION_PREFIX=!sd
AI_CONFIG_PREFIX=!config
```
