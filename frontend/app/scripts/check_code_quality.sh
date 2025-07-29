#!/bin/bash

# Saiondo Flutter App - Code Quality Check Script
# This script runs various code quality checks before committing

set -e

echo "🔍 Running code quality checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "pubspec.yaml" ]; then
    print_error "pubspec.yaml not found. Please run this script from the Flutter project root."
    exit 1
fi

# 1. Format check
echo "📝 Checking code format..."
if ! dart format --set-exit-if-changed lib/ test/; then
    print_error "Code formatting issues found. Run 'dart format lib/ test/' to fix."
    exit 1
fi
print_status "Code format check passed"

# 2. Analyze code
echo "🔍 Running static analysis..."
if ! flutter analyze; then
    print_error "Static analysis found issues. Please fix them before committing."
    exit 1
fi
print_status "Static analysis passed"

# 3. Run tests
echo "🧪 Running tests..."
if ! flutter test; then
    print_error "Tests failed. Please fix them before committing."
    exit 1
fi
print_status "All tests passed"

# 4. Check for TODO/FIXME comments
echo "📋 Checking for TODO/FIXME comments..."
TODO_COUNT=$(grep -r "TODO\|FIXME" lib/ --include="*.dart" | wc -l)
if [ "$TODO_COUNT" -gt 0 ]; then
    print_warning "Found $TODO_COUNT TODO/FIXME comments:"
    grep -r "TODO\|FIXME" lib/ --include="*.dart" | head -5
    if [ "$TODO_COUNT" -gt 5 ]; then
        echo "... and $(($TODO_COUNT - 5)) more"
    fi
else
    print_status "No TODO/FIXME comments found"
fi

# 5. Check for print statements (if not in debug mode)
echo "🖨️  Checking for print statements..."
PRINT_COUNT=$(grep -r "print(" lib/ --include="*.dart" | grep -v "// ignore: avoid_print" | wc -l)
if [ "$PRINT_COUNT" -gt 0 ]; then
    print_warning "Found $PRINT_COUNT print statements. Consider using logger instead:"
    grep -r "print(" lib/ --include="*.dart" | grep -v "// ignore: avoid_print" | head -3
    if [ "$PRINT_COUNT" -gt 3 ]; then
        echo "... and $(($PRINT_COUNT - 3)) more"
    fi
else
    print_status "No print statements found"
fi

# 6. Check pub dependencies
echo "📦 Checking pub dependencies..."
if ! flutter pub deps --style=compact | grep -q "✓"; then
    print_warning "Some dependencies might have issues"
else
    print_status "Dependencies check passed"
fi

echo ""
print_status "All code quality checks completed successfully! 🎉"
echo ""
echo "💡 Tips:"
echo "  - Run 'dart format lib/ test/' to format code"
echo "  - Run 'flutter analyze' to check for issues"
echo "  - Run 'flutter test' to run tests"
echo "  - Use logger instead of print statements"
echo "  - Add '// ignore: rule_name' to suppress specific lint warnings" 