# Text-To-Speech (EXPERIMENTAL)

The TTS feature allows the bot to answer with voice messages instead of text messages. You can actually talk to the bot.

You can enable it by setting the following environment variable:

```bash
TTS_ENABLED=true
```

By default, when TTS is enabled, the bot will answer two messages: the text response and the audio response.

You can disable the text response by changing the following environment variable:

```bash
TTS_TRANSCRIPTION_RESPONSE_ENABLED=true
```

## Supported Providers

-   [Speech API](#speech-api)
-   [AWS Polly](#aws-polly)

## Speech API

This feature will use the Speech API to convert the GPT response to voice. It's open source and you can host it yourself.

You can find the source code here:

-   https://github.com/askrella/speech-rest-api

By default the bot will use our hosted Speech API (for free). You can change the URL by setting the following environment variables:

```bash
SPEECH_API_URL=<your-speech-api-url>
TTS_MODE=speech-api
```

## AWS Polly

You can use Amazon Web Services Polly to convert the GPT response to voice.

You can find the official documentation here:

-   https://docs.aws.amazon.com/polly/latest/dg/what-is.html

You can enable this service by setting the following environment variables:

```bash
TTS_ENABLED=true
TTS_PROVIDER=aws-polly
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_REGION=<your-aws-region>
AWS_POLLY_VOICE_ID=<your-aws-polly-voice-id>
AWS_POLLY_VOICE_ENGINE=<your-aws-polly-voice-engine>
```

The provided AWS credentials must have the `polly:SynthesizeSpeech` permission.

You can find the list of available regions here:

-   https://docs.aws.amazon.com/general/latest/gr/rande.html#polly_region

You can find the list of available voices here:

-   https://docs.aws.amazon.com/polly/latest/dg/voicelist.html

And the list of available engines here:

-   https://docs.aws.amazon.com/polly/latest/dg/engines.html

Keep in mind that the AWS Polly service is not free. You will be charged for the usage, so make sure to check the pricing before enabling it.
