#!/usr/bin/env node

/**
 * Component Usage Analyzer
 * 
 * This script analyzes the React component usage across the codebase
 * to identify:
 * 1. Component duplication
 * 2. Import patterns
 * 3. Usage frequency
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const EXCLUDED_DIRS = [
  'node_modules',
  '.next',
  'out',
  'dist',
  '.git',
  '.github',
];
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];

// Results storage
const componentDefinitions = new Map();
const componentImports = new Map();
const componentUsage = new Map();

/**
 * Find all component files in the codebase
 */
function findComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !EXCLUDED_DIRS.includes(file)) {
      findComponentFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      COMPONENT_EXTENSIONS.includes(path.extname(file))
    ) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Analyze a file to find component definitions and imports
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(ROOT_DIR, filePath);
  
  // Check if file contains a component definition
  const exportDefaultMatch = content.match(/export\s+default\s+function\s+(\w+)/g);
  const exportNamedMatch = content.match(/export\s+function\s+(\w+)/g);
  const constComponentMatch = content.match(/export\s+const\s+(\w+)\s*=\s*(\([^)]*\)|)\s*=>/g);
  
  // Extract component name from the most common patterns
  let componentName = null;
  
  if (exportDefaultMatch) {
    const match = exportDefaultMatch[0].match(/export\s+default\s+function\s+(\w+)/);
    if (match && match[1]) {
      componentName = match[1];
    }
  } else if (exportNamedMatch) {
    const match = exportNamedMatch[0].match(/export\s+function\s+(\w+)/);
    if (match && match[1]) {
      componentName = match[1];
    }
  } else if (constComponentMatch) {
    const match = constComponentMatch[0].match(/export\s+const\s+(\w+)/);
    if (match && match[1]) {
      componentName = match[1];
    }
  }
  
  if (componentName) {
    if (!componentDefinitions.has(componentName)) {
      componentDefinitions.set(componentName, []);
    }
    componentDefinitions.get(componentName).push(relativePath);
  }
  
  // Find component imports
  const importMatches = content.matchAll(/import\s+(?:{([^}]+)}|\*\s+as\s+([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+))\s+from\s+['"]([^'"]+)['"]/g);
  
  for (const match of importMatches) {
    const namedImports = match[1] ? match[1].split(',').map(s => s.trim()) : [];
    const namespaceImport = match[2];
    const defaultImport = match[3];
    const importPath = match[4];
    
    if (defaultImport) {
      recordImport(defaultImport, importPath, relativePath);
    }
    
    if (namespaceImport) {
      recordImport(namespaceImport, importPath, relativePath);
    }
    
    if (namedImports.length > 0) {
      namedImports.forEach(namedImport => {
        // Handle aliased imports like: import { Button as MuiButton }
        const aliasMatch = namedImport.match(/(\w+)\s+as\s+(\w+)/);
        if (aliasMatch) {
          recordImport(aliasMatch[2], importPath, relativePath);
        } else {
          recordImport(namedImport, importPath, relativePath);
        }
      });
    }
  }
  
  // Analyze JSX usage to find component usage
  const jsxMatches = content.matchAll(/<([A-Z][a-zA-Z0-9]*)/g);
  for (const match of jsxMatches) {
    const component = match[1];
    if (!componentUsage.has(component)) {
      componentUsage.set(component, 0);
    }
    componentUsage.set(component, componentUsage.get(component) + 1);
  }
}

/**
 * Record an import in the componentImports map
 */
function recordImport(importName, importPath, sourceFile) {
  if (!componentImports.has(importName)) {
    componentImports.set(importName, { sources: new Map() });
  }
  
  const importInfo = componentImports.get(importName);
  
  if (!importInfo.sources.has(importPath)) {
    importInfo.sources.set(importPath, []);
  }
  
  importInfo.sources.get(importPath).push(sourceFile);
}

/**
 * Print analysis results in a readable format
 */
function printResults() {
  console.log('\n=== Component Definitions ===');
  console.log('(Components defined in multiple files may indicate duplication)\n');
  
  const duplicatedComponents = [];
  
  for (const [component, files] of componentDefinitions.entries()) {
    if (files.length > 1) {
      duplicatedComponents.push({ component, files });
      console.log(`\x1b[31m${component}\x1b[0m (defined in ${files.length} files):`);
      files.forEach(file => console.log(`  - ${file}`));
    }
  }
  
  console.log('\n=== Import Sources ===');
  console.log('(Shows where components are imported from)\n');
  
  for (const [component, info] of componentImports.entries()) {
    if (info.sources.size > 1) {
      console.log(`\x1b[33m${component}\x1b[0m (imported from ${info.sources.size} different paths):`);
      for (const [importPath, files] of info.sources.entries()) {
        console.log(`  - ${importPath} (used in ${files.length} files)`);
      }
    }
  }
  
  console.log('\n=== Component Usage ===');
  console.log('(Top 20 most frequently used components)\n');
  
  const sortedUsage = [...componentUsage.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  
  for (const [component, count] of sortedUsage) {
    console.log(`${component}: ${count} uses`);
  }
  
  if (duplicatedComponents.length > 0) {
    console.log('\n\x1b[41m DUPLICATED COMPONENTS FOUND \x1b[0m\n');
    console.log('Create a compatibility layer to address these duplications:');
    console.log('\nexample.ts:');
    console.log('```typescript');
    console.log('// Re-export components from a single source');
    console.log('export { Button, ButtonProps } from \'@/components/ui/button\';');
    console.log('```');
  } else {
    console.log('\n\x1b[42m NO DUPLICATED COMPONENTS FOUND \x1b[0m\n');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('Analyzing component usage in codebase...');
  
  try {
    const componentFiles = findComponentFiles(SRC_DIR);
    console.log(`Found ${componentFiles.length} component files to analyze.`);
    
    componentFiles.forEach(file => {
      analyzeFile(file);
    });
    
    printResults();
  } catch (error) {
    console.error('Error analyzing components:', error);
    process.exit(1);
  }
}

main(); 