
export function getWebviewContent(code: string): string {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Refactored Code</title>
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
          <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                  margin: 0;
                  padding: 20px;
                  min-width: 760px;
              }
              pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    background-color: #000;
                    color: #fff; /* Optional: Sets the text color to white for contrast */
                    padding: 20px;
                    border-radius: 4px;
                    font-family: monospace; /* Optional: Ensures monospace font for code-like display */
                }
              .toast {
                  visibility: hidden;
                  min-width: 250px;
                  margin-left: -125px;
                  background-color: #4caf50;
                  color: white;
                  text-align: center;
                  border-radius: 2px;
                  position: fixed;
                  z-index: 1;
                  left: 50%;
                  bottom: 30px;
                  font-size: 17px;
              }
              .toast.show {
                  visibility: visible;
                  animation: fadein 0.5s, fadeout 0.5s 2.5s;
              }
              @keyframes fadein {
                  from {bottom: 0; opacity: 0;}
                  to {bottom: 30px; opacity: 1;}
              }
              @keyframes fadeout {
                  from {bottom: 30px; opacity: 1;}
                  to {bottom: 0; opacity: 0;}
              }
          </style>
      </head>
        <body>
            <h1>Refactored Code</h1>
            <pre id="code-block"><code class="language-python">${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
            <button id="copy-btn"><i class="fas fa-copy"></i> Copy Code</button>
            <div id="toast" class="toast">Code copied to clipboard!</div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/components/prism-python.min.js"></script>

            <script>
                function copyToClipboard() {
                    const codeElement = document.getElementById('code-block');
                    const range = document.createRange();
                    range.selectNodeContents(codeElement);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    try {
                        document.execCommand('copy');
                        selection.removeAllRanges(); // Clear the selection after copying

                        // Show toast notification
                        const toast = document.getElementById('toast');
                        toast.className = "toast show";
                        setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
                    } catch (err) {
                        console.error('Failed to copy text', err);
                    }
                }

                document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
            </script>
        </body>
      </html>
  `;
}


export function getWebviewChatContent() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ChatBot</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background: linear-gradient(135deg, #001, #001);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              #chat-container {
                  width: 600px;
                  height: 600px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
              }
              #chatbox {
                  flex-grow: 1;
                  padding: 20px;
                  overflow-y: auto;
                  border-bottom: 1px solid #eee;
                  background-color: ##071720;
              }
              #userInputContainer {
                  display: flex;
                  padding: 10px;
                  background-color: #f0f0f0;
                  border-top: 1px solid #ddd;
              }
              #userInput {
                  flex-grow: 1;
                  padding: 10px;
                  border: 1px solid #ccc;
                  border-radius: 4px;
                  margin-right: 10px;
              }
              #sendBtn {
                  padding: 10px 20px;
                  background-color: #007acc;
                  color: white;
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                  transition: background-color 0.3s;
              }
              #sendBtn:hover {
                  background-color: #005fa3;
              }
              /* Message styles */
              .message {
                  margin-bottom: 20px;
              }
              .message strong {
                  display: block;
                  margin-bottom: 5px;
              }
              .message .bot-message {
                  background-color: #252728;
                  padding: 10px;
                  border-radius: 5px;
              }
              .message .user-message {
                  background-color: #252728;
                  padding: 10px;
                  border-radius: 5px;
                  text-align: right;
              }
              /* Code block styles */
              pre {
                  background-color: #000;
                  color: #ffffff;
                  padding: 10px;
                  border-radius: 5px;
                  position: relative;
                  margin-top: 10px;
              }
              pre code {
                  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                  white-space: pre-wrap;
              }
              .copy-btn {
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  background-color: #007acc;
                  color: white;
                  border: none;
                  padding: 5px 10px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 12px;
                  transition: background-color 0.3s;
              }
              .copy-btn:hover {
                  background-color: #005fa3;
              }
          </style>
          <!-- Include Marked.js for Markdown parsing -->
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <!-- Include Highlight.js for syntax highlighting -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
      </head>
      <body>
          <div id="chat-container">
              <div id="chatbox"></div>
              <div id="userInputContainer">
                  <input type="text" id="userInput" placeholder="Ask me something..." />
                  <button id="sendBtn">Send</button>
              </div>
          </div>

          <script>
              const vscode = acquireVsCodeApi();

              const chatbox = document.getElementById('chatbox');
              const userInput = document.getElementById('userInput');
              const sendBtn = document.getElementById('sendBtn');

              // Function to add messages to the chatbox
              function addMessage(sender, text, isBot = false) {
                  const messageDiv = document.createElement('div');
                  messageDiv.classList.add('message');
                  
                  const senderStrong = document.createElement('strong');
                  senderStrong.textContent = sender + ':';
                  messageDiv.appendChild(senderStrong);

                  const messageContent = document.createElement('div');
                  messageContent.className = isBot ? 'bot-message' : 'user-message';
                  
                  // Parse the message text as Markdown
                  messageContent.innerHTML = marked.parse(text);

                  // Apply syntax highlighting to any code blocks
                  messageContent.querySelectorAll('pre code').forEach((block) => {
                      hljs.highlightElement(block);
                  });

                  // Add copy buttons to code blocks
                  messageContent.querySelectorAll('pre').forEach((pre) => {
                      const copyBtn = document.createElement('button');
                      copyBtn.textContent = 'Copy';
                      copyBtn.classList.add('copy-btn');
                      pre.appendChild(copyBtn);

                      copyBtn.addEventListener('click', () => {
                          const code = pre.querySelector('code').textContent;
                          navigator.clipboard.writeText(code).then(() => {
                              copyBtn.textContent = 'Copied!';
                              setTimeout(() => {
                                  copyBtn.textContent = 'Copy';
                              }, 2000);
                          });
                      });
                  });

                  messageDiv.appendChild(messageContent);
                  chatbox.appendChild(messageDiv);
                  chatbox.scrollTop = chatbox.scrollHeight;
              }

              sendBtn.addEventListener('click', () => {
                  const message = userInput.value.trim();
                  if (message === '') return;

                  addMessage('You', message);
                  userInput.value = '';

                  // Send the message to VSCode extension backend
                  vscode.postMessage({
                      command: 'chatInput',
                      text: message
                  });
              });

              // Allow sending messages by pressing Enter
              userInput.addEventListener('keypress', (event) => {
                  if (event.key === 'Enter') {
                      sendBtn.click();
                      event.preventDefault();
                  }
              });

              // Handle messages from VSCode backend
              window.addEventListener('message', (event) => {
                  const message = event.data;
                  if (message.command === 'chatResponse') {
                      addMessage('Bot', message.text, true);
                  }
              });
          </script>
      </body>
      </html>
    `;
}




