const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/templates/vendor-profile-tabs');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix variable reference for status
  content = content.replace(/([a-zA-Z0-9_?.]+status)\s*(===|==)\s*200\s*\|\|\s*status\s*(===|==)\s*2000/g, '$1 $2 200 || $1 $3 2000');

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log("Fixed status variables");
