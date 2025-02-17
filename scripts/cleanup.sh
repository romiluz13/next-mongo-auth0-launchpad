#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Cleaning up project structure...${NC}"

# Remove unnecessary UI components
echo -e "\n${GREEN}Removing unnecessary UI components...${NC}"
rm -rf src/components/ui/calendar.tsx
rm -rf src/components/ui/navigation-menu.tsx
rm -rf src/components/ui/breadcrumb.tsx
rm -rf src/components/ui/pagination.tsx
rm -rf src/components/ui/dropdown-menu.tsx
rm -rf src/components/ui/accordion.tsx
rm -rf src/components/ui/alert.tsx
rm -rf src/components/ui/avatar.tsx
rm -rf src/components/ui/badge.tsx
rm -rf src/components/ui/checkbox.tsx
rm -rf src/components/ui/dialog.tsx
rm -rf src/components/ui/form.tsx
rm -rf src/components/ui/input.tsx
rm -rf src/components/ui/label.tsx
rm -rf src/components/ui/menubar.tsx
rm -rf src/components/ui/popover.tsx
rm -rf src/components/ui/progress.tsx
rm -rf src/components/ui/radio-group.tsx
rm -rf src/components/ui/scroll-area.tsx
rm -rf src/components/ui/select.tsx
rm -rf src/components/ui/separator.tsx
rm -rf src/components/ui/sheet.tsx
rm -rf src/components/ui/skeleton.tsx
rm -rf src/components/ui/slider.tsx
rm -rf src/components/ui/switch.tsx
rm -rf src/components/ui/table.tsx
rm -rf src/components/ui/tabs.tsx
rm -rf src/components/ui/textarea.tsx
rm -rf src/components/ui/toast.tsx
rm -rf src/components/ui/toggle.tsx
rm -rf src/components/ui/tooltip.tsx

# Create essential directories
echo -e "\n${GREEN}Creating essential directories...${NC}"
mkdir -p src/components/layout
mkdir -p src/components/ui
mkdir -p src/lib/models
mkdir -p src/styles

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
tree src
echo -e "${NC}" 