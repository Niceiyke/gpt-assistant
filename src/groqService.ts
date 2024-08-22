import Groq from "groq-sdk";
import * as vscode from "vscode";
// Fetching the API key and model from VS Code settings
const groqConfig = vscode.workspace.getConfiguration('gptAssistant');
const apiKey = groqConfig.get<string>('apiKey','');
const model = groqConfig.get<string>('model', 'llama3-8b-8192');


vscode.window.showInformationMessage(`API Key: ${apiKey}`);


// Initialize Groq SDK with the API key
const groq = new Groq({ apiKey });

class GroqGPTService {
  private groq: any;
  private customModel: string;

  constructor() {
      // Initial setup
      this.customModel = model;
      this.updateConfiguration();

      // Listen for configuration changes
      vscode.workspace.onDidChangeConfiguration((event) => {
          if (event.affectsConfiguration('gptAssistant.apiKey') || event.affectsConfiguration('gptAssistant.model')) {
              this.updateConfiguration();
          }
      });
  }

  private updateConfiguration() {
      // Fetch updated configuration values
      const groqConfig = vscode.workspace.getConfiguration('gptAssistant');
      const apiKey = groqConfig.get<string>('apiKey', '');
      this.customModel = groqConfig.get<string>('model', 'llama3-8b-8192');

      // Reinitialize Groq instance with the new API key
      this.groq = new Groq({ apiKey });
  }
    async RefactorCode(code: string,lang:string,){
        let chatCompletion=await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `Refactor this ${lang} code to improve its readability, maintainability, and performance. The refactored code should be equivalent in functionality to the original code, but with improved structure, naming conventions, and coding standards`,
              },
              {
                role: "user",
                content: code
              },
            ],
            model: this.customModel
          });
          return chatCompletion.choices[0]?.message?.content || ""
        } 

      async DocumentCode(code: string,lang:string){
        let chatCompletion=await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `Document this ${lang} code in a concise format `,
            },
            {
              role: "user",
              content: code
            },
          ],
          model: this.customModel
        });
        return chatCompletion.choices[0]?.message?.content || ""
        }
        async suggestFeatures(code: string,lang:string){
          let chatCompletion=await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `study this ${lang} code and suggest extra features that might be useful in this context. return the code implementation. `,
              },
              {
                role: "user",
                content: code
              },
            ],
            model: this.customModel
          });
          return chatCompletion.choices[0]?.message?.content || ""
          }

          async askGPT(question: string){
            let chatCompletion=await groq.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: `your a helpfull coding assistant`,
                },
                {
                  role: "user",
                  content: question
                },
              ],
              model: this.customModel
            });
            return chatCompletion.choices[0]?.message?.content || ""
            }

}
export default GroqGPTService
