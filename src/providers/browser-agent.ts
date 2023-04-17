import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain";
import { SerpAPI, DynamicTool, RequestsGetTool } from "langchain/tools";
import { initializeAgentExecutor } from "langchain/agents";

export default class BrowserAgentProvider {
	// Can use other browser tools like RequestGetTool if you do not have a [SerpAPI](https://serpapi.com/) API key.
	tools = [
		new SerpAPI(),
		// new RequestsGetTool(),
		new DynamicTool({
			name: "Others",
			description:
				"Use this tool when the output no longer requires searching on the Internet or fetching from a URL",
			func: function (prompt) {
				return Promise.resolve(
					"No further action, use your best judgment for the final answer using the prompt below:\n" + prompt
				);
			}
		})
	];
	// Always select highest probability word in search
	model = new OpenAI({ temperature: 0 });
	prompt = new PromptTemplate({
		template:
			"Answer the following question as accurately as you can, feel free to use bullet point and formatting for clarity. If there's no tool suitable, return the current observation: \n{question}",
		inputVariables: ["question"]
	});

	fetch = async (query) => {
		const executor = await initializeAgentExecutor(this.tools, this.model, "chat-zero-shot-react-description");
		const input = await this.prompt.format({ question: query });
		const result = await executor.call({ input });

		return result.output; // Return the final text instead of result.output
	};
}
