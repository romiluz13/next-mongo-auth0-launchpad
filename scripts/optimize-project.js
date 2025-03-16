#!/usr/bin/env node

/**
 * Project Optimization Script
 * 
 * This script will:
 * 1. Delete duplicate components in src/features/ui/components
 * 2. Update imports in files that use these components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Files to remove (duplicates)
const duplicates = [
  'src/features/ui/components/Badge.tsx',
  'src/features/ui/components/Button.tsx',
  'src/features/ui/components/Card.tsx'
];

// Find imports to update
const findImportsCommand = `grep -r "from '@/features/ui/components" src --include="*.tsx" --include="*.ts"`;
console.log(`Finding imports to update: ${findImportsCommand}`);

try {
  // Execute find imports command
  const importResults = execSync(findImportsCommand, { encoding: 'utf8' });
  
  // Print the files with imports to update
  console.log('Files with imports to update:');
  console.log(importResults);
  
  // Delete duplicate files
  console.log('\nDeleting duplicate files:');
  duplicates.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
        console.log(`✅ Deleted: ${file}`);
      } catch (err) {
        console.error(`❌ Failed to delete ${file}:`, err);
      }
    } else {
      console.log(`⚠️ File doesn't exist: ${file}`);
    }
  });
  
  // Check if the features/ui/components directory is empty
  const componentsDir = 'src/features/ui/components';
  if (fs.existsSync(componentsDir)) {
    const remainingFiles = fs.readdirSync(componentsDir);
    if (remainingFiles.length === 0) {
      try {
        fs.rmdirSync(componentsDir);
        console.log(`✅ Removed empty directory: ${componentsDir}`);
      } catch (err) {
        console.error(`❌ Failed to remove directory ${componentsDir}:`, err);
      }
    } else {
      console.log(`⚠️ Directory not empty, remaining files: ${remainingFiles.join(', ')}`);
    }
  }
  
  // Recommended manual updates
  console.log('\n=== Manual Updates Required ===');
  console.log('Please update the following imports in your code:');
  console.log('- Change: import { Badge } from "@/features/ui/components/Badge"');
  console.log('- To:     import { Badge } from "@/components/ui/badge"');
  console.log('\n- Change: import { Button } from "@/features/ui/components/Button"');
  console.log('- To:     import { Button } from "@/components/ui/button"');
  console.log('\n- Change: import { Card, ... } from "@/features/ui/components/Card"');
  console.log('- To:     import { Card, ... } from "@/components/ui/card"');
  
  // Create index.ts file to maintain backwards compatibility
  console.log('\nCreating index.ts for backward compatibility:');
  
  const featuresUiDir = 'src/features/ui';
  if (!fs.existsSync(featuresUiDir)) {
    fs.mkdirSync(featuresUiDir, { recursive: true });
    console.log(`✅ Created directory: ${featuresUiDir}`);
  }
  
  const indexContent = `/**
 * Re-export UI components from the shared components directory
 * for backward compatibility.
 * 
 * Note: This is a temporary solution. Direct imports from '@/components/ui/*'
 * are preferred.
 */

export { Badge, badgeVariants } from '@/components/ui/badge';
export { Button, buttonVariants } from '@/components/ui/button';
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
`;

  fs.writeFileSync(path.join(featuresUiDir, 'index.ts'), indexContent);
  console.log(`✅ Created: ${featuresUiDir}/index.ts`);
  
  console.log('\n✅ Optimization completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Update imports in your code (see Manual Updates above)');
  console.log('2. Run tests to ensure everything works correctly');
  console.log('3. Remove the features/ui/index.ts file once all imports are updated');
  
} catch (error) {
  console.error('❌ Error executing optimization script:', error.message);
  process.exit(1);
} 