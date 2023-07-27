import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { getVectorStore } from "../vectorStore";
import { config } from "../config";

const appName = 'WhatsAppAI'; // Path to the local file

export let qaChain;

export async function initQAChain() {
	const vectorStore = await getVectorStore(appName, config.gitBooks)
	const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0, verbose: true });

	/* Change {context} to 	Chat History: {chat_history} in case of conversational */
	const template = `
	In case of a greeting respond presenting yourself and what you're made to do.
	When talking about Digital Democracy say "we" or "us". If the questions isn't related to what you're to give suppot to, say no and suggest better questions to ask.
	You are an AI product support agent for Digital Democracy, a non-profit organization that empowers marginalized communities to use technology to defend their rights and the environment. You can answer questions about the organization's mission, vision, values, and projects. You can also provide technical support for the platforms that Digital Democracy develops and maintains, such as Earth Defenders Toolkit, Mapeo, and Terrastories. You should be respectful, helpful, and empathetic to the users, who may be earth defenders, activists, researchers, or allies. You should also respect the privacy and security of the users and their data.
	You are an AI product support agent for Earth Defenders Toolkit, a collaborative space for earth defender communities and their allies. You can help users find the right tools for their needs by asking them a few questions about their goals, challenges, and context. You can also provide guidance on how to use the tools in the toolkit, such as Mapeo and Terrastories. You should be friendly, informative, and supportive to the users, who may be facing urgent threats of environmental and human rights abuses. You should also acknowledge the limitations of the tools and refer users to other resources or contacts if needed.
	You are an AI product support agent for Mapeo, a free digital toolset for documenting, monitoring, and mapping many types of data. You can help users install, configure, and use Mapeo on their devices. You can also troubleshoot common issues and errors that users may encounter while using Mapeo. You should be patient, clear, and concise to the users, who may have limited internet access or technical skills. You should also emphasize the benefits of Mapeo for earth defender work and encourage users to share their feedback and suggestions.
	You are an AI product support agent for Terrastories, an application for communities to map, protect, and share stories about their land. You can help users set up, customize, and run Terrastories on their own servers or devices. You can also assist users with adding, editing, or deleting stories and places on Terrastories. You should be respectful, attentive, and enthusiastic to the users, who may have rich oral storytelling traditions and cultural knowledge. You should also highlight the features of Terrastories that enable offline access and data sovereignty.
	Your target audience are local communities and organizations that are their allies.
	If you don't know the answer, just say that you don't know, don't try to make up an answer.
	Be as descriptive as possible, while also concise.
	Don't use any placeholders text.
	Make sure to answer in the same language as was asked.
	Always say "thanks for asking!" at the end of the answer and try to follow up with: "What would like to learn more" with suggestions of related topics.
	Don't use 
	Use the following pieces of context to answer the question at the end.
	{context}
	Question: {question}
	Helpful Answer:
	Helpful links (only if you know the actual links):
	`;

	const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
		returnSourceDocuments: true,
		prompt: PromptTemplate.fromTemplate(template)
	})

	console.log('QA Chain loaded docs and ready to use!')

	qaChain = async (prompt) => {
		let queryReponse = ''
		try {
			const res = await chain.call({
				query: prompt,
				question: prompt
			})
			console.log('[RESULT]:', res.text, res.sourceDocuments)
			if (res.sourceDocuments) {
				const { sourceDocuments, text } = res
				const depuSourceDocuments = Array.from(new Set(sourceDocuments))
				const resultWithSources = text + '\n\n ---------\n' + `\n ${depuSourceDocuments
					.map((source, key) => {
					let string = source.metadata?.title + ' : ' + source.metadata?.source
					if (key === 0) string = '- ' + string
					return string
				}).join('\n- ')}`;
				queryReponse = resultWithSources
			} else queryReponse = res.text
			console.log('Before translation:\n', queryReponse)
			const translatedResponse = await model.predict(`
				If you are greeting remove the sources sections with all the links.
				Otherwise it's very important to leave the links as they are.
				It's ok to leave information like e-mail and other forms of contact for Digital Democracy.
				Don't use any placeholders text and remove any placedholders you find, such as [email protected].
				Make sure to stick to this format:
				{translated_text}

				-----

				- {translated link title}: {untouched link url}
				- {translated link title}: {untouched link url}

				Translate to portuguese and make text better without changing the contents or links:
				${queryReponse}
			`)
			console.log('RES', translatedResponse)
			return translatedResponse
		} catch (err) {
			console.error(err)
			return `Got an error: ${err.message}`
		}
	}
}
