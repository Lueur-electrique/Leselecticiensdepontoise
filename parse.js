const fs = require('fs');

const text = fs.readFileSync('extracted_lines.txt', 'utf8');
const lines = text.split('\n');

for (const line of lines) {
    if (!line.includes('write_to_file')) continue;
    
    // We can extract TargetFile and CodeContent using RegExp
    // The format is usually JSON inside JSON.
    // Let's just find the first match of TargetFile
    let targetMatch = line.match(/"TargetFile"\s*:\s*"([^"]+)"/);
    if (!targetMatch) {
        // try with escaped quotes
        targetMatch = line.match(/\\"TargetFile\\"\s*:\s*\\"([^"]+)\\"/);
    }
    
    if (targetMatch) {
        let target = targetMatch[1].replace(/\\\\/g, '\\').replace(/\\\//g, '/');
        console.log('Found Target: ' + target);
        
        let codeMatch = line.match(/"CodeContent"\s*:\s*"(.*?)"(?:,|})/);
        if (!codeMatch) {
            codeMatch = line.match(/\\"CodeContent\\"\s*:\s*\\"(.*?)\\"(?:,|})/);
        }
        if (codeMatch) {
            let code = codeMatch[1];
            // Decode the escaped string
            try {
                // Try to parse it as JSON string to unescape \n, \", etc.
                code = JSON.parse('"' + code + '"');
            } catch (e) {
                // fallback manual unescape
                code = code.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            }
            
            if (target.endsWith('index.html') || target.endsWith('services.html')) {
                // write to disk
                const outTarget = target.substring(target.lastIndexOf('\\') + 1).replace('electriciens-pontoise\\', '');
                
                // Fix logo and fonts
                code = code.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
                code = code.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" \/>/g, '');
                
                fs.writeFileSync(outTarget, code, 'utf8');
                console.log('Restored fully: ' + outTarget);
            }
        }
    }
}
