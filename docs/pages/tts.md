# Text-To-Speech (EXPERIMENTAL)

The TTS feature allows the bot to answer with voice messages instead of text messages. You can actually talk to the bot.

You can enable it by setting the following environment variable:

```bash
TTS_ENABLED=true
```

This feature will use the Speech API to convert the GPT response to voice. It's open source and you can host it yourself.

You can find the source code here:

-   https://github.com/askrella/speech-rest-api

By default the bot will use our hosted Speech API (for free). You can change the URL by setting the following environment variable:

```bash
SPEECH_API_URL=<your-speech-api-url>
```
