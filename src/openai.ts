import { ChatGPTAPI } from 'chatgpt'
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment variables
import dotenv from 'dotenv';
dotenv.config();

// Open AI API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// ChatGPT Client
export const chatgpt = new ChatGPTAPI({
    apiKey: OPENAI_API_KEY,
})

// OpenAI Client
export const openai = new OpenAIApi(
    new Configuration({
        apiKey: OPENAI_API_KEY,
    })
);
