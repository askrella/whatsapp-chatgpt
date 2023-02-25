# Auto Decide Model
With this enabled, you can talk to the chatbot and it will automatically decide if it would be better for DALLE or GPT to respond to your input.

## Disabling Auto Model Decision

You can disable the auto model decision by setting the `AUTO_MODEL` environment variable in your `.env` file.

## Notes
**This will (currently) more than double the amount of tokens used per input!!!**

With `AUTO_MODEL` enabled, you should keep prefixes OFF. If prefixes are on, then `AUTO_MODEL` does nothing.