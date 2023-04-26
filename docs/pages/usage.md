# Usage

To use the bot, simply send a message with the `!gpt`/`!dalle`/`!sd`/`!config` command followed by your prompt. For example:

### GPT

```
!gpt What is the meaning of life?
```

### DALLE

```
!dalle A frog with a red hat is walking on a bridge.
```

### Stable Diffusion

```
!sd A frog with a red hat is walking on a bridge.
```

It is using huggingface's stable diffusion model for image rendering, you might change the model with `!config sd setModel <model>` command.

### AI Config

To modify the bot's configuration, you can use the `!config` command. Run `!config help` for detail:

```
Available commands:
	!config dalle size <value> - Set dalle size to <value>
	!config chat id - Get the ID of the chat
	!config general settings - Get current settings
	!config general whitelist <value> - Set whitelisted phone numbers
	!config gpt apiKey <value> - Set token pool, support multiple tokens with comma-separated
	!config gpt maxModelTokens <value> - Set max model tokens value
	!config transcription enabled <value> - Toggle if transcription is enabled
	!config transcription mode <value> - Set transcription mode
	!config tts enabled <value> - Toggle if TTS is enabled
	!config sd setModel <value> - Set the model to be used of Stable Diffusion (with huggingface)

Available values:
	dalle size: 256x256, 512x512, 1024x1024
	gpt apiKey: sk-xxxx,sk-xxxx
	gpt maxModelTokens: integer
	transcription enabled: true, false
	transcription mode: local, speech-api, whisper-api, openai
	tts enabled: true, false
	sd setModel: runwayml/stable-diffusion-v1-5
```
