const fs = require('fs');

const logPath = 'C:\\Users\\PaulM\\.gemini\\antigravity\\brain\\7fb65235-361b-4e3a-a15a-a6ac508e7aff\\.system_generated\\logs\\transcript_full.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (const line of lines) {
    if (!line.includes('write_to_file')) continue;
    
    try {
        let parsedLine = JSON.parse(line);
        if (parsedLine.tool_calls) {
            for (let call of parsedLine.tool_calls) {
                let func = call.function || call;
                if (func.name === 'write_to_file' || func.name === 'default_api:write_to_file') {
                    let args = func.arguments;
                    if (typeof args === 'string') args = JSON.parse(args);
                    
                    let target = args.TargetFile;
                    let content = args.CodeContent;
                    
                    // The values might be double JSON encoded strings
                    if (typeof target === 'string' && target.startsWith('"')) target = JSON.parse(target);
                    if (typeof content === 'string' && content.startsWith('"')) content = JSON.parse(content);
                    
                    if (target && content && target.endsWith('.html')) {
                        let filename = target.split('\\\\').pop().split('\\').pop();
                        
                        // Apply fixes
                        content = content.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
                        content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" \/>/g, '');
                        
                        fs.writeFileSync(filename, content, 'utf8');
                        console.log('Successfully recovered: ' + filename);
                    }
                }
            }
        }
    } catch (e) {
        // ignore parse errors
    }
}
