# Message Filtering

The following documentation explains the bot message filtering feature that allows the bot to ignore incoming messages that are not on the allow list.
Configuration Parameters

There are three configuration parameters for the bot message filtering feature:
- DEFAULT_DENY: This parameter defines whether the bot should ignore incoming messages if they are not on the allow list. If this parameter is set to true, then the bot will only allow messages that are explicitly listed on the ALLOW_LIST. If it is set to false, then the bot will allow all messages except for those listed on the BLOCK_LIST.

- ALLOW_LIST: This parameter is a comma-separated list of phone numbers that the bot should allow messages from. If DEFAULT_DENY is set to false, this list will be ignored.

- BLOCK_LIST: This parameter is a comma-separated list of phone numbers that the bot should block messages from. If DEFAULT_DENY is set to true, this list will be ignored.

## Usage

To use the bot message filtering feature, modify the configuration parameters in the configuration file according to your needs. If DEFAULT_DENY is set to true, add the phone numbers you want to allow to the ALLOW_LIST parameter, and add any phone numbers you want to block to the BLOCK_LIST parameter. If DEFAULT_DENY is set to false, add the phone numbers you want to block to the BLOCK_LIST parameter.

Separate phone numbers by a comma and use the format 1xxxxxxxxxx@c.us, where 1 is the country code, xxxxxxxxxx is the phone number, and @c.us is the WhatsApp domain.
Example

Here is an example configuration for the bot message filtering feature:

```
# Enables the bot message filtering feature
DEFAULT_DENY=true

# Allow messages only from these numbers
ALLOW_LIST=1xxxxxxxxxx@c.us,1yyyyyyyyy@c.us

# Block messages from these numbers
BLOCK_LIST=1zzzzzzzzz@c.us,1wwwwwwwww@c.us
```

In this example, the bot will only allow messages from the phone numbers 1xxxxxxxxxx and 1yyyyyyyyy, and block messages from the phone numbers 1zzzzzzzzz and 1wwwwwwwww.