import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: 'xai-3QDwulmNXJaa2oja9GZAspoqNb8qhVR8ELbeohpzDgis8mrkXRIJtf7iEbKLcxXh1PpxvyjKDkjZrcjp',
  baseURL: "https://api.x.ai/v1",
});



class GroKGPTService {
  private customModel: string;

  constructor() {
      // Initial setup
      this.customModel = "grok-2-1212";

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
                  content: `your a helpful coding assistant`,
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
export default GroKGPTService
