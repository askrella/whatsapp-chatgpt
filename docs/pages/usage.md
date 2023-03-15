# Usage

To use the bot, simply send a message with the `!gpt`/`!dalle`/`!config` command followed by your prompt. For example:

### Enabled Commands

You can modifiy the enabled commands that can be used.

You have to modify the `ENABLED_COMMANDS` environment variable. For example:

```
ENABLED_COMMANDS= ["gpt", "dalle", "reset", "config"]
```

### GPT

```
!gpt What is the meaning of life?
```

### DALLE

```
!dalle A frog with a red hat is walking on a bridge.
```

### AI Config

To modify the bot's configuration, you can use the `!config` command. For example:

```
!config <target> <type> <value>

e.g.
!config dalle size 256x256
```
