const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\PaulM\\.gemini\\antigravity\\brain\\7fb65235-361b-4e3a-a15a-a6ac508e7aff\\.system_generated\\logs\\transcript_full.jsonl';

async function processLineByLine() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const files = {};

  for await (const line of rl) {
    if (line.includes('write_to_file')) {
      try {
        const data = JSON.parse(line);
        if (data.tool_calls) {
          for (const tc of data.tool_calls) {
            let funcName = tc.name || (tc.function && tc.function.name);
            if (funcName && (funcName === 'write_to_file' || funcName === 'default_api:write_to_file')) {
              let args = tc.arguments || (tc.function && tc.function.arguments);
              if (typeof args === 'string') {
                args = JSON.parse(args);
              }
              
              let pathStr = args.TargetFile;
              if (typeof pathStr === 'string' && pathStr.startsWith('"')) pathStr = JSON.parse(pathStr);
              
              let content = args.CodeContent;
              if (typeof content === 'string' && content.startsWith('"')) content = JSON.parse(content);

              if (pathStr && pathStr.endsWith('.html') && content) {
                files[pathStr] = content;
              }
            }
          }
        }
      } catch (err) {}
    }
  }

  let found = 0;
  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith('index.html') || path.endsWith('services.html')) {
        let fixedContent = content.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
        // Fix font imports
        fixedContent = fixedContent.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" \/>/g, '');
        
        // Ensure path uses forward slashes or correct backslashes
        const outPath = path.replace(/\\\\/g, '\\');
        fs.writeFileSync(outPath, fixedContent, 'utf8');
        console.log('Restored: ' + outPath);
        found++;
    }
  }
  console.log('Found ' + found + ' files to restore');
}

processLineByLine();
