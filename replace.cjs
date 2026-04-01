const fs = require('fs');
const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/brand-gold/g, 'brand-accent');
content = content.replace(/gold-gradient/g, 'accent-gradient');
fs.writeFileSync(path, content);
console.log('Replaced colors in App.tsx');
