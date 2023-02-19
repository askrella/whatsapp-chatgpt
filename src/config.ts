import type ConfigType from "./types/config";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

const config:ConfigType = {
	prefixEnabled: process.env.PREFIX_ENABLED == "true",
	gptPrefix: "!gpt",
	dallePrefix: "!dalle"
}

export { config };
