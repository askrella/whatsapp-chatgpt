import * as cli from "../cli/ui";
import config from "../config";
import { openai } from "../providers/openai";

/**
 * Handle prompt moderation
 *
 * @param prompt Prompt to moderate
 * @returns true if the prompt is safe, throws an error otherwise
 */
const moderateIncomingPrompt = async (prompt: string) => {
	cli.print("[MODERATION] Checking user prompt...");
	const moderationResponse = await openai.createModeration({
		input: prompt
	});

	const moderationResponseData = moderationResponse.data;
	const moderationResponseCategories = moderationResponseData.results[0].categories;
	const blackListedCategories = config.promptModerationBacklistedCategories;

	cli.print(`[MODERATION] OpenAI Moderation response: ${JSON.stringify(moderationResponseData)}`);

	// Check if any of the backlisted categories are set to true
	for (const category of blackListedCategories) {
		if (moderationResponseCategories[category]) {
			cli.print(`[MODERATION] Prompt was rejected by the moderation system. Category: ${category}`);
			throw new Error(`Prompt was rejected by the moderation system. Reason: ${category}`);
		}
	}

	cli.print("[MODERATION] Prompt was accepted by the moderation system.");

	return true;
};

export { moderateIncomingPrompt };
