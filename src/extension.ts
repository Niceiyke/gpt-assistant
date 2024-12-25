
// Import necessary modules from VSCode and custom services
import * as vscode from 'vscode';
import { getWebviewContent } from './webview';
import GroKGPTService from './grokService';

// Define interface for extension configuration
interface IExtensionConfig {
  apiKey: string;
}

// Main class for the GPT Assistant Extension
class GPTAssistantExtension {
  private groqService: GroKGPTService;
  private config: IExtensionConfig;

  constructor(private context: vscode.ExtensionContext) {
    this.config = this.getConfiguration();
    this.groqService = new GroKGPTService();
    this.initializeCommands();
  }

  // Retrieve and validate the extension configuration
  private getConfiguration(): IExtensionConfig {
    const config = vscode.workspace.getConfiguration('gptAssistant');
    const apiKey = config.get<string>('apiKey');
    if (!apiKey) {
      vscode.window.showErrorMessage('API key is not set. Please configure the GPT Assistant API key.');
      throw new Error('API key is missing');
    }
    return { apiKey };
  }

  // Initialize VSCode commands for the extension
  private initializeCommands(): void {
    this.registerCommand('gpt-assistant.refactorCode', this.refactorCode.bind(this));
    this.registerCommand('gpt-assistant.documentCode', this.documentCode.bind(this));
    this.registerCommand('gpt-assistant.newFeature', this.suggestNewFeature.bind(this));
    this.registerCommand('gpt-assistant.askQuestion', this.askQuestion.bind(this));
  }

  // Register a command with VSCode
  private registerCommand(commandId: string, callback: (...args: any[]) => any): void {
    this.context.subscriptions.push(vscode.commands.registerCommand(commandId, callback));
  }

  // Get content from the active editor
  private async getActiveEditorContent(): Promise<{ editor: vscode.TextEditor; code: string; language: string } | null> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No editor is active');
      return null;
    }
    const code = editor.document.getText();
    const language = editor.document.languageId;
    return { editor, code, language };
  }

  // Create a webview panel to display content
  private async createWebviewPanel(title: string, content: string): Promise<void> {
    const panel = vscode.window.createWebviewPanel('gpt-assistant', title, vscode.ViewColumn.Beside, { enableScripts: true });
    panel.webview.html = getWebviewContent(content);
  }

  // Refactor the code using the Grok service
  private async refactorCode(): Promise<void> {
    const editorContent = await this.getActiveEditorContent();
    if (!editorContent) return;
    const { code, language } = editorContent;
    const refactoredCode = await this.groqService.RefactorCode(code, language);
    if (refactoredCode) await this.createWebviewPanel('Refactor Code', refactoredCode);
  }

  // Document the code using the Grok service
  private async documentCode(): Promise<void> {
    const editorContent = await this.getActiveEditorContent();
    if (!editorContent) return;
    const { code, language } = editorContent;
    const documentedCode = await this.groqService.DocumentCode(code, language);
    if (documentedCode) await this.createWebviewPanel('Document Code', documentedCode);
  }

  // Suggest new features for the code using the Grok service
  private async suggestNewFeature(): Promise<void> {
    const editorContent = await this.getActiveEditorContent();
    if (!editorContent) return;
    const { code, language } = editorContent;
    const newFeatures = await this.groqService.suggestFeatures(code, language);
    if (newFeatures) await this.createWebviewPanel('New Features', newFeatures);
  }

  // Ask a question to the GPT service
  private async askQuestion(): Promise<void> {
    const userInput = await vscode.window.showInputBox({
      placeHolder: 'Ask your question',
      prompt: 'Please enter your input',
      validateInput: (text) => (text.trim().length === 0 ? 'Input cannot be empty' : null)
    });
    if (!userInput) {
      vscode.window.showErrorMessage('No input provided!');
      return;
    }
    const response = await this.groqService.askGPT(userInput);
    if (response) await this.createWebviewPanel('GPT Response', response);
  }
}

// Activate the extension
export function activate(context: vscode.ExtensionContext): void {
  try {
    new GPTAssistantExtension(context);
  } catch (error) {
    console.error('Failed to activate GPT Assistant extension:', error);
  }
}

// Deactivate the extension (empty function)
export function deactivate(): void {}
