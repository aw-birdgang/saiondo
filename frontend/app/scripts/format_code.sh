#!/bin/bash

# Saiondo Flutter App - Code Formatting Script
# This script formats all Dart code in the project

set -e

echo "🎨 Formatting code..."

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ pubspec.yaml not found. Please run this script from the Flutter project root."
    exit 1
fi

# Format Dart code
echo "📝 Formatting Dart files..."
dart format lib/ test/

print_status "Code formatting completed!"

echo ""
echo "💡 Next steps:"
echo "  - Run './scripts/check_code_quality.sh' to verify code quality"
echo "  - Run 'flutter analyze' to check for any remaining issues" 