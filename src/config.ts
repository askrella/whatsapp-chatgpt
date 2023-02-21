import process from "process";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Interface
interface IConfig {
	openAIAPIKey: string;
	newsRSSURL: string;
	maxRSSItems: number;
	prefixEnabled: boolean;
	gptPrefix: string;
	dallePrefix: string;
	aiConfigPrefix: string;
	newsPrefix: string;
}

// Config
const config: IConfig = {
	openAIAPIKey: process.env.OPENAI_API_KEY || "", // Default: ""
	newsRSSURL: process.env.NEWS_RSS_URL || "https://www.yahoo.com/news/rss", // Default: https://www.yahoo.com/news/rss
	maxRSSItems: process.env.MAX_RSS_ITEMS || 7, // Default: 7
	prefixEnabled: process.env.PREFIX_ENABLED == "true" || true, // Default: true
	gptPrefix: process.env.GPT_PREFIX ||  "!gpt", // Default: !gpt
	dallePrefix: process.env.DALLE_PREFIX || "!dalle", // Default: !dalle
	aiConfigPrefix: process.env.AI_CONFIG_PREFIX || "!config", // Default: !config
	newsPrefix: process.env.NEWS_PREFIX || "!news", // Default: !news
};

export default config;
