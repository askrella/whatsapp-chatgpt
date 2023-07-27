import fs from "fs";
import path from "path";
import os from "os";
import { GitbookLoader } from "langchain/document_loaders/web/gitbook";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { HNSWLib } from "langchain/vectorstores/hnswlib";

const configDir = path.join(os.homedir(), ".config");

// Function to check if a file is less than x days old
function checkIfFileHasMoreThanXStringOccurrences(filePath, targetString = "{", countThreshold = 1) {
	// Read the file content
	const fileContent = fs.readFileSync(filePath, "utf-8");
	// Get the number of occurrences of the target string
	const occurrences = (fileContent.match(new RegExp(targetString, "g")) || []).length;
	// Check if the number of occurrences exceeds the threshold
	return occurrences > countThreshold;
}
function isUpToDate(filePath, xDays) {
	try {
		if (!checkIfFileHasMoreThanXStringOccurrences(filePath)) return false;
		const fileStats = fs.statSync(filePath);
		const fileModifiedDate = fileStats.mtime;
		const currentDate = new Date();
		const timeDifference = currentDate - fileModifiedDate;
		const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		return daysDifference < xDays;
	} catch (e) {
		console.error(e);
	}
}
async function getGitBook(url): Promise<void> {
	const loader = new GitbookLoader(url, {
		shouldLoadAllPaths: true
	});
	return loader.load();
}
// Function to fetch the file and save it locally
async function fetchAndSaveFile(gitBooks, filePath) {
	try {
		let documents = [];
		for await (const book of gitBooks) {
			console.log("\nReading book", book);
			const doc = await getGitBook(book);
			documents.push(...doc);
		}
		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0
		});
		const splitDocs = await textSplitter.splitDocuments(documents);
		const serializedVectorDocuments = JSON.stringify(splitDocs);
		// Save the serialized vector store to a file or database
		fs.writeFileSync(filePath, serializedVectorDocuments);
		console.log("File fetched and saved successfully!");
		return splitDocs;
	} catch (error) {
		console.error("Error fetching or saving the file:", error);
	}
}

const getVectorStore = async (appName, gitBooks, xDays = 7) => {
	const filePath = path.join(configDir, appName + ".db");
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, "", { flag: "w" });
	}
	if (isUpToDate(filePath, xDays)) {
		console.log("File is less than", xDays, "days old. No need to fetch again.");
		const serializedVectorDocuments = fs.readFileSync(filePath, "utf8");
		// Deserialize the vector store
		const deserializedVectorDocuments = JSON.parse(serializedVectorDocuments);
		// Create a new instance of HNSWLib and load the deserialized vector store
		const vectorStore = await HNSWLib.fromDocuments(deserializedVectorDocuments, new OpenAIEmbeddings());
		return vectorStore;
	} else {
		const vectorDocuments = await fetchAndSaveFile(gitBooks, filePath);
		const vectorStore = await HNSWLib.fromDocuments(vectorDocuments, new OpenAIEmbeddings());
		return vectorStore;
	}
};

export { getVectorStore };
