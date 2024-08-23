import { ChatGroq } from "@langchain/groq";
import { BufferMemory, } from "langchain/memory";
import { ConversationChain} from "langchain/chains";

import * as vscode from "vscode";
// Fetching the API key and model from VS Code settings
const groqConfig = vscode.workspace.getConfiguration('gptAssistant');
const apiKey = groqConfig.get<string>('apiKey','');
const model = groqConfig.get<string>('model', 'llama3-8b-8192');


// In-memory storage for conversation history
const memory = new BufferMemory();

// Function to handle chat input and get a response from LangChain
export async function handleChatInput(userInput: string): Promise<string> {

    const chatBot = new ChatGroq({
        apiKey: apiKey,
        model:model,
      
    });

    const chain = new ConversationChain({
        llm: chatBot,
        memory,
      
    });

    const response = await chain.call({ input: userInput });
  
    return response.response;
}