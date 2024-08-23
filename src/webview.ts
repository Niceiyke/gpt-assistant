
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
                  padding: 20px;
              }
              #chatbox {
                  width: 100%;
                  height: 300px;
                  overflow-y: scroll;
                  border: 1px solid #ddd;
                  padding: 10px;
              }
              #userInput {
                  width: 80%;
              }
          </style>
      </head>
      <body>
          <h1>ChatBot Interface</h1>
          <div id="chatbox"></div>
          <input type="text" id="userInput" placeholder="Ask me something..." />
          <button id="sendBtn">Send</button>

          <script>
              const vscode = acquireVsCodeApi();

              const chatbox = document.getElementById('chatbox');
              const userInput = document.getElementById('userInput');
              const sendBtn = document.getElementById('sendBtn');

              sendBtn.addEventListener('click', () => {
                  const message = userInput.value;
                  chatbox.innerHTML += '<div><strong>You:</strong> ' + message + '</div>';
                  userInput.value = '';

                  // Send the message to VSCode extension backend
                  vscode.postMessage({
                      command: 'chatInput',
                      text: message
                  });
              });

              // Handle messages from VSCode backend
              window.addEventListener('message', (event) => {
                  const message = event.data;
                  if (message.command === 'chatResponse') {
                      chatbox.innerHTML += '<div><strong>Bot:</strong> ' + message.text + '</div>';
                      chatbox.scrollTop = chatbox.scrollHeight;
                  }
              });
          </script>
      </body>
      </html>
    `;
}



