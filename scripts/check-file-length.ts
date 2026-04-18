import fs from 'fs';
import path from 'path';

const MAX_LINES = 500;
const TARGET_DIRS = ['src', 'convex'];
const EXCLUDE_PATTERN = /_generated/;

async function checkFileLength(filePath: string) {
  if (EXCLUDE_PATTERN.test(filePath)) {
    return;
  }

  const relativePath = path.relative(process.cwd(), filePath);
  const isInTargetDir = TARGET_DIRS.some((dir) =>
    relativePath.startsWith(dir + path.sep) || relativePath === dir
  );

  if (!isInTargetDir) {
    return;
  }

  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;

  if (lines > MAX_LINES) {
    console.error(
      `\x1b[31mError: File "${relativePath}" exceeds the ${MAX_LINES} line limit (${lines} lines).\x1b[0m`
    );
    console.error(
      `\x1b[33mSuggestion: Please refactor this file by splitting it into smaller, more focused components or modules.\x1b[0m`
    );
    process.exit(1);
  }
}

const files = process.argv.slice(2);

if (files.length === 0) {
  // If no files provided as args, we could scan the whole project, 
  // but for git hooks, we expect files to be passed.
  console.log('No files provided to check-file-length.');
} else {
  for (const file of files) {
    checkFileLength(path.resolve(file));
  }
}
