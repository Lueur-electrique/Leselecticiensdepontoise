const https = require('https');
https.get('https://lueur-electrique.github.io/Leselecticiensdepontoise/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
     console.log('--- HEAD ---');
     console.log(data.substring(0, 1500));
     console.log('--- SEARCHING CSS ---');
     let match = data.match(/href=["'](.*?.css)["']/i);
     console.log('CSS Link found: ' + (match ? match[1] : 'NONE'));
  });
});
