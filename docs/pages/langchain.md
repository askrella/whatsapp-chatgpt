# LangChain

## About

Use this handler to allow GPT to interact with other sources of data, ie. the internet, or different mediums like pdfs and images. Ideally the user doesn't have to differentiate between GPT instances that can and cannot use external data sources, but we'll keep them separate for ease of implementation for now.

## Example

In the following example, GPT uses `SerpAPI` as a tool to access Google Search API. You can use `RequestsGetTool` and parse the HTML if you don't have a [SerpAPI](https://serpapi.com/) API key.

> !lang nba game april 11st 2023
>
> // Uses SerpAPI or RequestsGetTool to access the search engine, parse results in either JSON or HTML, and have GPT interpret the best answer for the prompt.
> "The result of the NBA games on April 11st 2023 is Minnesota Timberwolves vs Los Angeles Lakers"

## Tools

Abstractions for GPT to interact with to interact with external data sources. For example, both `RequestGetTools` and `SerpAPI` allows GPT to access the internet.

See other tools in the LangChain [Tools section](https://js.langchain.com/docs/modules/agents/tools/).

## References

-   [LangChain in JS](https://js.langchain.com/docs/)
-   [LangChain in Python](https://python.langchain.com/en/latest/index.html)
