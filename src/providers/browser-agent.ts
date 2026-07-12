import config from "../config";
import { runAIWebSearch } from "./ai";

export default class BrowserAgentProvider {
	async fetch(query: string): Promise<string> {
		if (!config.serpApiKey) {
			throw new Error("SERPAPI_API_KEY is required for web search");
		}
		return runAIWebSearch(query, (searchQuery) => this.search(searchQuery));
	}

	private async search(query: string): Promise<unknown> {
		const url = new URL("https://serpapi.com/search.json");
		url.searchParams.set("engine", "google");
		url.searchParams.set("q", query);
		url.searchParams.set("api_key", config.serpApiKey);

		const searchResponse = await fetch(url);
		if (!searchResponse.ok) {
			throw new Error(`SerpAPI request failed (${searchResponse.status}): ${await searchResponse.text()}`);
		}

		const searchResults = (await searchResponse.json()) as {
			answer_box?: unknown;
			organic_results?: unknown[];
		};
		const relevantResults = {
			answerBox: searchResults.answer_box,
			organicResults: searchResults.organic_results?.slice(0, 5)
		};
		return relevantResults;
	}
}
