#!/usr/bin/env node

/**
 * Component Optimizer Script
 * 
 * This script helps identify duplicate UI components between 
 * src/components/ui and src/features/ui/components.
 * 
 * It also provides recommendations for consolidation.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');  // You may need to install this: npm install chalk

// Paths to analyze
const COMPONENTS_PATH = path.join(process.cwd(), 'src/components/ui');
const FEATURE_UI_PATH = path.join(process.cwd(), 'src/features/ui/components');

// Check if directories exist
if (!fs.existsSync(COMPONENTS_PATH)) {
  console.error(chalk.red(`Directory not found: ${COMPONENTS_PATH}`));
  process.exit(1);
}

if (!fs.existsSync(FEATURE_UI_PATH)) {
  console.warn(chalk.yellow(`Directory not found: ${FEATURE_UI_PATH}`));
  console.log(chalk.blue('No duplicate components to check.'));
  process.exit(0);
}

// Get list of component files
const componentFiles = fs.readdirSync(COMPONENTS_PATH)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

const featureUiFiles = fs.readdirSync(FEATURE_UI_PATH)
  .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));

console.log(chalk.green('=== Component Analysis ===\n'));

// Find duplicates
const duplicates = componentFiles.filter(file => 
  featureUiFiles.includes(file)
);

if (duplicates.length > 0) {
  console.log(chalk.yellow(`Found ${duplicates.length} potential duplicate components:`));
  
  duplicates.forEach(file => {
    const componentPath = path.join(COMPONENTS_PATH, file);
    const featurePath = path.join(FEATURE_UI_PATH, file);
    
    // Get file stats
    const componentStats = fs.statSync(componentPath);
    const featureStats = fs.statSync(featurePath);
    
    console.log(chalk.cyan(`\n${file}:`));
    console.log(`  - src/components/ui/${file} (${Math.round(componentStats.size / 1024 * 100) / 100} KB)`);
    console.log(`  - src/features/ui/components/${file} (${Math.round(featureStats.size / 1024 * 100) / 100} KB)`);
    
    // Compare sizes
    if (Math.abs(componentStats.size - featureStats.size) < 10) {
      console.log(chalk.red('  - Files are nearly identical in size and likely duplicates'));
    } else {
      console.log(chalk.yellow('  - Files differ in size but may have similar functionality'));
    }
  });
  
  console.log(chalk.green('\nRecommendation:'));
  console.log('Compare these files for functional duplications and consider consolidating them.');
  console.log('The shared components should be kept in src/components/ui, while');
  console.log('feature-specific components should be kept in their feature directories.');
} else {
  console.log(chalk.green('No duplicate component files found!'));
}

// Check for components in features that aren't being imported elsewhere
console.log(chalk.green('\n=== Feature Component Usage Analysis ===\n'));

if (featureUiFiles.length > 0) {
  console.log(chalk.blue(`Found ${featureUiFiles.length} UI components in features directory.`));
  console.log(chalk.yellow('Recommendation: Check if these components can be consolidated into src/components/ui:'));
  
  featureUiFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
} else {
  console.log(chalk.green('No feature-specific UI components found.'));
}

// Provide suggestions for next steps
console.log(chalk.green('\n=== Next Steps ===\n'));
console.log('1. Review the identified components and determine if consolidation is needed');
console.log('2. When consolidating:');
console.log('   - Move shared components to src/components/ui');
console.log('   - Keep feature-specific components in their feature directories');
console.log('   - Update imports in all files');
console.log('3. Run tests to ensure functionality is maintained');
console.log('4. Document your component organization decisions');

console.log(chalk.green('\nComplete!')); 