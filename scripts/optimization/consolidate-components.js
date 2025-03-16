#!/usr/bin/env node

/**
 * Component Consolidation Script
 * 
 * This script identifies and helps consolidate duplicate components between
 * src/components/ui and src/features/ui/components.
 */

const fs = require('fs');
const path = require('path');

// Paths
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/ui');
const FEATURES_UI_DIR = path.join(process.cwd(), 'src/features/ui/components');

console.log('Checking for component directories:');
console.log(`- Components directory: ${COMPONENTS_DIR}`);
console.log(`  Exists: ${fs.existsSync(COMPONENTS_DIR)}`);
console.log(`- Features UI directory: ${FEATURES_UI_DIR}`);
console.log(`  Exists: ${fs.existsSync(FEATURES_UI_DIR)}`);

// Check if both directories exist
if (!fs.existsSync(COMPONENTS_DIR)) {
  console.error(`Error: ${COMPONENTS_DIR} doesn't exist.`);
  process.exit(1);
}

if (!fs.existsSync(FEATURES_UI_DIR)) {
  console.log(`Note: ${FEATURES_UI_DIR} doesn't exist. No duplicate components to consolidate.`);
  process.exit(0);
}

// Get lists of files
const sharedComponents = fs.readdirSync(COMPONENTS_DIR)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

const featureComponents = fs.readdirSync(FEATURES_UI_DIR)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

console.log('\nFound components:');
console.log(`- Shared components (${sharedComponents.length}):`, sharedComponents);
console.log(`- Feature components (${featureComponents.length}):`, featureComponents);

console.log('\n=== Component Consolidation ===\n');

// Normalize filenames for case-insensitive comparison
const normalizedSharedComponents = sharedComponents.map(name => name.toLowerCase());

// Find duplicates
const duplicates = [];

featureComponents.forEach(featureFile => {
  const normalizedFeatureFile = featureFile.toLowerCase();
  const index = normalizedSharedComponents.findIndex(
    sharedFile => sharedFile === normalizedFeatureFile
  );
  
  if (index !== -1) {
    duplicates.push({
      featureFile,
      sharedFile: sharedComponents[index],
      featurePath: path.join(FEATURES_UI_DIR, featureFile),
      sharedPath: path.join(COMPONENTS_DIR, sharedComponents[index])
    });
  }
});

// Display results
if (duplicates.length === 0) {
  console.log('No duplicate components found after case-insensitive matching.');
  process.exit(0);
}

console.log(`Found ${duplicates.length} duplicate components:\n`);

duplicates.forEach(({ featureFile, sharedFile, featurePath, sharedPath }) => {
  const featureContent = fs.readFileSync(featurePath, 'utf8');
  const sharedContent = fs.readFileSync(sharedPath, 'utf8');
  
  // Compare content
  const contentMatch = featureContent === sharedContent;
  
  console.log(`${featureFile} (in features) vs ${sharedFile} (in components)`);
  console.log(`  Content identical: ${contentMatch ? 'Yes' : 'No'}`);
  
  if (!contentMatch) {
    const featureLines = featureContent.split('\n').length;
    const sharedLines = sharedContent.split('\n').length;
    console.log(`  Lines: ${featureLines} vs ${sharedLines}`);
  }
  
  // Check imports
  const featureImports = extractImports(featureContent);
  const sharedImports = extractImports(sharedContent);
  
  console.log('  Feature imports:', featureImports);
  console.log('  Shared imports:', sharedImports);
  console.log();
});

// Actions to take
console.log('=== Recommended Actions ===\n');
console.log('For each duplicate component:');
console.log('1. Compare the implementations and determine which one to keep');
console.log('2. Delete the duplicate after updating any imports');
console.log('3. Update any references to the deleted component\n');

duplicates.forEach(({ featureFile, sharedFile }) => {
  console.log(`For ${featureFile}/${sharedFile}:`);
  console.log(`  - Check references to both src/features/ui/components/${featureFile} and src/components/ui/${sharedFile}`);
  console.log(`  - Consider keeping the version in src/components/ui/ for consistency`);
  console.log();
});

// Helper functions
function extractImports(content) {
  const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
} 