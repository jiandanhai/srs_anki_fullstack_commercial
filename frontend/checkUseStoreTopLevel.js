import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, 'src');

function isTopLevelUseStore(fileContent) {
  const lines = fileContent.split('\n');
  let insideFunctionOrComponent = false;
  let braceStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(.*\)\s*=>/.test(line)) {
      insideFunctionOrComponent = true;
      braceStack.push('{');
    }

    if (insideFunctionOrComponent) {
      braceStack.push(...line.split('').filter(c => c === '{'));
      braceStack.pop(...line.split('').filter(c => c === '}'));
      if (braceStack.length === 0) {
        insideFunctionOrComponent = false;
      }
    } else {
      if (line.includes('useStore(')) {
        return i + 1;
      }
    }
  }
  return null;
}

function scanDir(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...scanDir(fullPath));
    } else if (/\.(ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const line = isTopLevelUseStore(content);
      if (line) {
        results.push({ file: fullPath, line });
      }
    }
  }
  return results;
}

const issues = scanDir(SRC_DIR);

if (issues.length === 0) {
  console.log('✅ 未发现顶层调用 useStore() 的情况');
} else {
  console.log('⚠️ 发现顶层调用 useStore():');
  issues.forEach(i => console.log(`- ${i.file}:${i.line}`));
}
