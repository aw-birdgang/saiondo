#!/bin/bash

# Saiondo Flutter App - Test Runner Script
# This script runs all tests with coverage

set -e

echo "🧪 Running tests..."

# Colors for output
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

# Check if we're in the right directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ pubspec.yaml not found. Please run this script from the Flutter project root."
    exit 1
fi

# Parse command line arguments
COVERAGE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --coverage)
            COVERAGE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--coverage] [--verbose]"
            exit 1
            ;;
    esac
done

# Run tests
if [ "$COVERAGE" = true ]; then
    echo "📊 Running tests with coverage..."
    if [ "$VERBOSE" = true ]; then
        flutter test --coverage --verbose
    else
        flutter test --coverage
    fi
    
    # Generate coverage report
if command -v genhtml &> /dev/null; then
    echo "📈 Generating HTML coverage report..."
    genhtml coverage/lcov.info -o coverage/html
    print_status "Coverage report generated at coverage/html/index.html"
else
    print_warning "genhtml not found. Install lcov to generate HTML coverage reports."
fi

# Show coverage summary
if command -v lcov &> /dev/null; then
    echo "📋 Coverage summary:"
    lcov --summary coverage/lcov.info
else
    # Fallback: show basic coverage info
    if [ -f "coverage/lcov.info" ]; then
        echo "📋 Coverage file generated at coverage/lcov.info"
        echo "Install lcov for detailed coverage reports:"
        echo "  macOS: brew install lcov"
        echo "  Ubuntu: sudo apt-get install lcov"
    fi
fi
else
    echo "🧪 Running tests..."
    if [ "$VERBOSE" = true ]; then
        flutter test --verbose
    else
        flutter test
    fi
fi

print_status "Tests completed!"

echo ""
echo "💡 Tips:"
echo "  - Use --coverage flag to generate coverage reports"
echo "  - Use --verbose flag for detailed test output"
echo "  - Check coverage/html/index.html for detailed coverage report" 