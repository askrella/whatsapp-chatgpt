# Transcription (EXPERIMENTAL)

The transcription feature allows you to use your voice to interact with the bot.
It's a great way to use the bot without having to type anything.

You can enable it by setting `TRANSCRIPTION_ENABLED=true` in your `.env` file.

There are two modes available:

-   `local`
-   `speech-api`

# Transcription Modes

## Local

For the local mode you need to have [whisper](https://github.com/openai/whisper) installed on your machine.

With local mode the voice messages will be transcribed on your machine. Best for privacy.

You need to install Python:

-   https://www.python.org/downloads/

Check out the whisper installation guide here:

-   https://github.com/openai/whisper#setup

Use the following environment variable to enable the local mode:

```bash
TRANSCRIPTION_MODE=local
```

## Speech-API

The Speech API is a REST API that converts your voice messages to text. The voice messages are processed on the server and not on your machine.

The Speech API doesn't store the voice messages permanently. It's open source and you can host it yourself.

You can find the source code here:

-   https://github.com/askrella/speech-rest-api

If you want use the Speech API mode you need to set the following environment variable:

```bash
TRANSCRIPTION_MODE=speech-api
```

By default the bot will use our hosted Speech API (for free). You can change the URL by setting the following environment variable:

```bash
SPEECH_API_URL=<your-speech-api-url>
```
