import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 상대 경로를 절대 경로로 변환하는 함수
function convertRelativeToAbsolute(filePath, importPath) {
  const dir = path.dirname(filePath);
  const fullPath = path.resolve(dir, importPath);
  const srcPath = path.resolve(path.join(__dirname, '..', 'src'));
  
  if (fullPath.startsWith(srcPath)) {
    const relativeToSrc = path.relative(srcPath, fullPath);
    return `@/${relativeToSrc.replace(/\\/g, '/')}`;
  }
  
  return importPath;
}

// 파일 내용을 업데이트하는 함수
function updateFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // 상대 경로 import 패턴 매칭
    const importPattern = /from\s+['"](\.\.?\/[^'"]+)['"]/g;
    
    content = content.replace(importPattern, (match, importPath) => {
      const absolutePath = convertRelativeToAbsolute(filePath, importPath);
      if (absolutePath !== importPath) {
        updated = true;
        return `from '${absolutePath}'`;
      }
      return match;
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// 모든 TypeScript/TSX 파일을 찾아서 업데이트
function updateAllFiles() {
  const srcDir = path.resolve(path.join(__dirname, '..', 'src'));
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        updateFileImports(filePath);
      }
    });
  }
  
  walkDir(srcDir);
}

// 스크립트 실행
console.log('🔄 Starting import path conversion...');
updateAllFiles();
console.log('✅ Import path conversion completed!'); 