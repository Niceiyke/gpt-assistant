import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "" });


class GroqGPTService {
constructor(private model: string = "llama3-8b-8192",) {
  }
    async RefactorCode(code: string,lang:string){
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
            model: this.model
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
          model: this.model
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
            model: this.model
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
              model: this.model
            });
            return chatCompletion.choices[0]?.message?.content || ""
            }

}
export default GroqGPTService
