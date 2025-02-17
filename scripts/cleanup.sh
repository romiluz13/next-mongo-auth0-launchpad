#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Cleaning up project structure...${NC}"

# Create essential directories
echo -e "\n${GREEN}Creating essential directories...${NC}"
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/lib/models
mkdir -p src/styles

# Function to show directory structure
show_structure() {
  if command -v tree &> /dev/null; then
    tree src
  else
    if command -v ls &> /dev/null; then
      ls -R src
    else
      echo "Unable to show directory structure"
    fi
  fi
}

# Remove unnecessary UI components if they exist
echo -e "\n${GREEN}Removing unnecessary UI components...${NC}"
rm -f src/components/ui/calendar.tsx
rm -f src/components/ui/navigation-menu.tsx
rm -f src/components/ui/breadcrumb.tsx
rm -f src/components/ui/pagination.tsx
rm -f src/components/ui/dropdown-menu.tsx
rm -f src/components/ui/accordion.tsx
rm -f src/components/ui/alert.tsx
rm -f src/components/ui/avatar.tsx
rm -f src/components/ui/badge.tsx
rm -f src/components/ui/checkbox.tsx
rm -f src/components/ui/dialog.tsx
rm -f src/components/ui/form.tsx
rm -f src/components/ui/input.tsx
rm -f src/components/ui/label.tsx
rm -f src/components/ui/menubar.tsx
rm -f src/components/ui/popover.tsx
rm -f src/components/ui/progress.tsx
rm -f src/components/ui/radio-group.tsx
rm -f src/components/ui/scroll-area.tsx
rm -f src/components/ui/select.tsx
rm -f src/components/ui/separator.tsx
rm -f src/components/ui/sheet.tsx
rm -f src/components/ui/skeleton.tsx
rm -f src/components/ui/slider.tsx
rm -f src/components/ui/switch.tsx
rm -f src/components/ui/table.tsx
rm -f src/components/ui/tabs.tsx
rm -f src/components/ui/textarea.tsx
rm -f src/components/ui/toast.tsx
rm -f src/components/ui/toggle.tsx
rm -f src/components/ui/tooltip.tsx

# Move files to proper locations
echo -e "\n${GREEN}Organizing files...${NC}"
mv src/components/nav.tsx src/components/layout/Nav.tsx
mv src/components/dashboard/sidebar.tsx src/components/layout/Sidebar.tsx

# Update imports in layout.tsx
echo -e "\n${GREEN}Updating imports...${NC}"
sed -i '' 's|@/components/nav|@/components/layout/Nav|g' src/app/layout.tsx

# Remove empty directories
echo -e "\n${GREEN}Cleaning up empty directories...${NC}"
find src -type d -empty -delete

echo -e "\n${BLUE}✨ Project structure cleaned up successfully!${NC}"
echo -e "Project structure is now organized as follows:"
echo -e "${GREEN}"
show_structure
echo -e "${NC}" 