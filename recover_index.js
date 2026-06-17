const fs = require('fs');

let line = fs.readFileSync('exact_index.txt', 'utf8');
if (line.charCodeAt(0) === 0xFEFF) {
  line = line.slice(1);
}

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
                
                if (typeof target === 'string' && target.startsWith('"')) target = JSON.parse(target);
                if (typeof content === 'string' && content.startsWith('"')) content = JSON.parse(content);
                
                if (target && content && target.endsWith('index.html')) {
                    content = content.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
                    content = content.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet" \/>/g, '');
                    
                    fs.writeFileSync('index.html', content, 'utf8');
                    console.log('Successfully recovered index.html!');
                }
            }
        }
    }
} catch (e) {
    console.log("JSON parse error:", e);
}
