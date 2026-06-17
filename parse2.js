const fs = require('fs');

const logPath = 'C:\\Users\\PaulM\\.gemini\\antigravity\\brain\\7fb65235-361b-4e3a-a15a-a6ac508e7aff\\.system_generated\\logs\\transcript_full.jsonl';
const text = fs.readFileSync(logPath, 'utf8');
const lines = text.split('\n');

for (const line of lines) {
    if (!line.includes('write_to_file')) continue;
    
    // Look for JSON string format
    let targetMatch = line.match(/"TargetFile"(?:\s*|\\)?:(?:\s*|\\)?"([^"]+)"/);
    if (!targetMatch) continue;
    
    let target = targetMatch[1].replace(/\\\\/g, '\\');
    if (!target.endsWith('index.html') && !target.endsWith('services.html')) continue;
    
    console.log('Found Target: ' + target);
    
    let codeMatch = line.match(/"CodeContent"(?:\s*|\\)?:(?:\s*|\\)?"(.*?)"(?:,|\s*\})/);
    if (codeMatch) {
        let code = codeMatch[1];
        
        try {
            // Unescape
            code = JSON.parse('"' + code + '"');
            if (typeof code === 'string' && code.includes('\\n')) {
                code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
        } catch (e) {
            code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        
        // Remove font tag
        code = code.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" \/>/g, '');
        // Update logo
        code = code.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
        
        const filename = target.split('\\').pop();
        fs.writeFileSync(filename, code, 'utf8');
        console.log('Restored: ' + filename);
    }
}
