const fs = require('fs');
const path = require('path');

const srcDir = 'd:/Mine/Mad_scientist/AGD/Anonymous-group-Debate/app_public/src/app';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update instances of 'btn-outline' to 'btn-primary'
      if (content.includes('btn-outline')) {
        content = content.replace(/btn-outline/g, 'btn-primary');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done replacing btn-outline.');
