import * as vscode from "vscode";
import { getWebviewContent } from "./webview";
import GroqGPTService from "./groqService";

export function activate(context: vscode.ExtensionContext) {
    // Access the settings
    const config = vscode.workspace.getConfiguration('gptAssistant');
    const apiKey = config.get<string>('apiKey');
    const model = config.get<string>('apiEndpoint');

    if (!apiKey) {
        vscode.window.showErrorMessage('API key is not set. Please configure the GPT Assistant API key.');
        return;
    }

    vscode.window.showInformationMessage(`API Key: ${apiKey}`);
    const groqService = new GroqGPTService(apiKey,model);

  context.subscriptions.push(
    vscode.commands.registerCommand("gpt=assistant.refactorCode", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }
      const language = editor.document.languageId;

      const code = editor.document.getText();

      const refactoredCode = await groqService.RefactorCode(code, language);
      if (refactoredCode) {
        const Refactorpanel = vscode.window.createWebviewPanel(
          "gpt-assistant",
          "Refactor Code",
          vscode.ViewColumn.Beside,

          { enableScripts: true }
        );
        Refactorpanel.webview.html = getWebviewContent(refactoredCode);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("gpt=assistant.documentCode", async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }
      const language = editor.document.languageId;

      const code = editor.document.getText();

      const documentCode = await groqService.DocumentCode(code, language);
      if (documentCode) {
        const Documentationpanel = vscode.window.createWebviewPanel(
          "gpt-assistant",
          "Refactor Code",
          vscode.ViewColumn.Beside,

          { enableScripts: true }
        );
        Documentationpanel.webview.html = getWebviewContent(documentCode);
      }
    }));

    context.subscriptions.push(
        vscode.commands.registerCommand("gpt=assistant.newFeature", async () => {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showInformationMessage("No editor is active");
            return;
          }
          const language = editor.document.languageId;
    
          const code = editor.document.getText();
    
          const newFeatures = await groqService.suggestFeatures(code, language);
          if (newFeatures) {
            const Documentationpanel = vscode.window.createWebviewPanel(
              "gpt-assistant",
              "Refactor Code",
              vscode.ViewColumn.Beside,
    
              { enableScripts: true }
            );
            Documentationpanel.webview.html = getWebviewContent(newFeatures);
          }
        }));
        context.subscriptions.push(
            vscode.commands.registerCommand("gpt=assistant.askQuestion", async () => {
              
                const userInput = await vscode.window.showInputBox({
                    placeHolder: "Type ask question",
                    prompt: "Please enter your input",
                    validateInput: (text) => {
                        return text.trim().length === 0 ? "Input cannot be empty" : null;
                    }
                });
        
                // If user provides input, display it in a notification
                if (userInput) {
                    const respons = await groqService.askGPT(userInput);
              if (respons) {
                const Documentationpanel = vscode.window.createWebviewPanel(
                  "gpt-assistant",
                  "Refactor Code",
                  vscode.ViewColumn.Beside,
        
                  { enableScripts: true }
                );
                Documentationpanel.webview.html = getWebviewContent(respons);
              }
                } else {
                    vscode.window.showErrorMessage('No input provided!');
                }
              
        

        
              
            }));
}

export function deactivate() {}
