import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace Grab Green with Facebook Blue
  content = content.replace(/#00B14F/g, '#1877F2');
  
  // Replace all green- with blue-
  content = content.replace(/green-/g, 'blue-');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir(path.join(__dirname, 'pages'));
walkDir(path.join(__dirname, 'components'));
walkDir(path.join(__dirname, 'hooks'));
walkDir(path.join(__dirname, 'services'));
replaceInFile(path.join(__dirname, 'App.tsx'));
replaceInFile(path.join(__dirname, 'index.tsx'));
replaceInFile(path.join(__dirname, 'constants.tsx'));
