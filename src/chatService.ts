import { ChatGroq } from "@langchain/groq";
import { BufferMemory, } from "langchain/memory";
import { ConversationChain} from "langchain/chains";


// OpenAI setup
const OPENAI_API_KEY = "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";

// In-memory storage for conversation history
const memory = new BufferMemory();

// Function to handle chat input and get a response from LangChain
export async function handleChatInput(userInput: string): Promise<string> {

    const chatBot = new ChatGroq({
        apiKey: OPENAI_API_KEY,
      
    });

    const chain = new ConversationChain({
        llm: chatBot,
        memory,
      
    });

    const response = await chain.call({ input: userInput });
  
    return response.response;
}