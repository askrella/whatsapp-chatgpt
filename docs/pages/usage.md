# Usage

To use the bot, simply send a message with the `!gpt`/`!dalle`/`!config` command followed by your prompt. For example:

### GPT

```
!gpt What is the meaning of life?
```

### DALLE

```
!dalle A frog with a red hat is walking on a bridge.
```

### AI Config

To modify the bot's configuration, you can use the `!config` command. Run `!config help` for detail:

```
Available commands:
	!config dalle size <value> - Set dalle size to <value>
	!config chat id - Get the ID of the chat
	!config general whitelist <value> - Set whitelisted phone numbers
	!config gpt maxModelTokens <value> - Set max model tokens value
	!config transcription enabled <value> - Toggle if transcription is enabled
	!config transcription mode <value> - Set transcription mode
	!config tts enabled <value> - Toggle if TTS is enabled

Available values:
	dalle size: 256x256, 512x512, 1024x1024
	gpt maxModelTokens: integer
	transcription enabled: true, false
	transcription mode: local, speech-api, whisper-api, openai
	tts enabled: true, false
```
