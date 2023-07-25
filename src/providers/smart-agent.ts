import { RequestsGetTool } from "langchain/tools";
import { GitbookLoader } from "langchain/document_loaders/web/gitbook";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

export let smartAgent;

const gitBooks = [
	"https://docs.earthdefenderstoolkit.com",
	"https://docs.mapeo.app"
]

async function getVectorStore() {
	let docs = []

	for await (const book of gitBooks) {
		console.log('Reading book', book)
		const doc = await getGitBook(book)
		docs.push(...doc);
	}
	const textSplitter = new RecursiveCharacterTextSplitter({
		chunkSize: 500,
		chunkOverlap: 0,
	});
	const splitDocs = await textSplitter.splitDocuments(docs);
	const embeddings = new OpenAIEmbeddings();
	return MemoryVectorStore.fromDocuments(splitDocs, embeddings);
}

async function getGitBook(url): Promise<void> {
	const loader = new GitbookLoader(url, {
		shouldLoadAllPaths: true,
	});
	return loader.load();
}

export async function initSmartAgent() {


	const vectorStore = await getVectorStore()

	const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });

	const template = `
	You are an AI product support agent for Digital Democracy, a non-profit organization that empowers marginalized communities to use technology to defend their rights and the environment. You can answer questions about the organization's mission, vision, values, and projects. You can also provide technical support for the platforms that Digital Democracy develops and maintains, such as Earth Defenders Toolkit, Mapeo, and Terrastories. You should be respectful, helpful, and empathetic to the users, who may be earth defenders, activists, researchers, or allies. You should also respect the privacy and security of the users and their data.
	You are an AI product support agent for Earth Defenders Toolkit, a collaborative space for earth defender communities and their allies. You can help users find the right tools for their needs by asking them a few questions about their goals, challenges, and context. You can also provide guidance on how to use the tools in the toolkit, such as Mapeo and Terrastories. You should be friendly, informative, and supportive to the users, who may be facing urgent threats of environmental and human rights abuses. You should also acknowledge the limitations of the tools and refer users to other resources or contacts if needed.
	You are an AI product support agent for Mapeo, a free digital toolset for documenting, monitoring, and mapping many types of data. You can help users install, configure, and use Mapeo on their devices. You can also troubleshoot common issues and errors that users may encounter while using Mapeo. You should be patient, clear, and concise to the users, who may have limited internet access or technical skills. You should also emphasize the benefits of Mapeo for earth defender work and encourage users to share their feedback and suggestions.
	You are an AI product support agent for Terrastories, an application for communities to map, protect, and share stories about their land. You can help users set up, customize, and run Terrastories on their own servers or devices. You can also assist users with adding, editing, or deleting stories and places on Terrastories. You should be respectful, attentive, and enthusiastic to the users, who may have rich oral storytelling traditions and cultural knowledge. You should also highlight the features of Terrastories that enable offline access and data sovereignty.
	Use the following pieces of context to answer the question at the end.
	If you don't know the answer, just say that you don't know, don't try to make up an answer.
	Use three sentences maximum and keep the answer as concise as possible.
	Always say "thanks for asking!" at the end of the answer.
	{context}
	Question: {question}
	Helpful Answer:
	Helpful links:
	`;

	const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
		prompt: PromptTemplate.fromTemplate(template),
	});

	console.log('Smart Agent loaded docs and ready to use!')

	smartAgent = async (prompt) => {
		try {
			const res = await chain.call({
				query: prompt
			})
			return res.text
		} catch (err) {
			console.error(err)
			return `Got an error: ${err.message}`
		}
	}
}
