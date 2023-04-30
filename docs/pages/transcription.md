# Transcription (EXPERIMENTAL)

The transcription feature allows you to use your voice to interact with the bot.
It's a great way to use the bot without having to type anything.

You can enable it by setting `TRANSCRIPTION_ENABLED=true` in your `.env` file.

There are multiple modes available:

-   `local`
-   `openai`
-   `speech-api`
-   `whisper-api`

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

## Using A Remote Transcription API

You might use an external API to turn audio into text, the voice messages are processed on the server and not on your machine.

## Open AI (Whisper)

To use the official Open AI transcription endpoint based on large-v2 Whisper model, you will need to ensure that you have the `OPENAI_API_KEY` environment variable set.

If you already have this set, you can proceed to set the `TRANSCRIPTION_MODE` environment variable:

```bash
TRANSCRIPTION_MODE=openai
```

The transcribed language is usually detected automatically, but if you want to ensure accurate language detection, you can set the environment variable `TRANSCRIPTION_LANGUAGE` to the desired language (for example, "English" for English, see [Supported Languages](https://github.com/openai/whisper#available-models-and-languages) for the full list).

```bash
TRANSCRIPTION_LANGUAGE=English
```

Remarks:

-   Please note that this endpoint has a file size limit of 25 MB, so it is recommended to avoid transcribing long audio files.

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

## Whisper API

The Whisper API is a REST API provided by AssemblyAI that is capable of converting voice messages into text. The voice messages are processed on the server, rather than on your own machine.

If you wish to use the Whisper API mode, you will need to set the environment variable

```bash
TRANSCRIPTION_MODE=whisper-api
```

To use the API, you must first sign up and obtain an API key from:

-   https://whisperapi.com/

The transcribed language is usually detected automatically, but if you want to ensure accurate language detection, you can set the environment variable `TRANSCRIPTION_LANGUAGE` to the desired language (for example, "en" for English).

```
TRANSCRIPTION_LANGUAGE=en
```
