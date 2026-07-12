# Web Search

## About

The `!lang` command uses an AI SDK tool loop to search Google through SerpAPI. It can refine its query and search repeatedly before answering. Set `SERPAPI_API_KEY` before using it.

## Example

In the following example, GPT uses [SerpAPI](https://serpapi.com/) to access Google Search:

> !lang nba game april 11st 2023
>
> // Uses SerpAPI as an AI SDK tool and has GPT interpret the results.
> "The result of the NBA games on April 11st 2023 is Minnesota Timberwolves vs Los Angeles Lakers"

## References

- [SerpAPI documentation](https://serpapi.com/search-api)
- [Vercel AI SDK tools](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)
