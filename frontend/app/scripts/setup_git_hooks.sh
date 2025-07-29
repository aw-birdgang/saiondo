#!/bin/bash

# Saiondo Flutter App - Git Hooks Setup Script
# This script sets up pre-commit hooks for code quality checks

set -e

echo "🔧 Setting up Git hooks..."

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

# Check if we're in a git repository (look for .git in current or parent directories)
GIT_ROOT=""
CURRENT_DIR="$(pwd)"

# Look for .git directory in current and parent directories
while [ "$CURRENT_DIR" != "/" ]; do
    if [ -d "$CURRENT_DIR/.git" ]; then
        GIT_ROOT="$CURRENT_DIR"
        break
    fi
    CURRENT_DIR="$(dirname "$CURRENT_DIR")"
done

if [ -z "$GIT_ROOT" ]; then
    echo "❌ Not in a git repository. Please run this script from within a git repository."
    exit 1
fi

echo "📁 Found git repository at: $GIT_ROOT"

# Check if we're in the right directory
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ pubspec.yaml not found. Please run this script from the Flutter project root."
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p "$GIT_ROOT/.git/hooks"

# Create pre-commit hook
cat > "$GIT_ROOT/.git/hooks/pre-commit" << 'EOF'
#!/bin/bash

# Saiondo Flutter App - Pre-commit Hook
# This hook runs code quality checks before each commit

set -e

echo "🔍 Running pre-commit checks..."

# Get the project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Run code quality checks
if [ -f "scripts/check_code_quality.sh" ]; then
    ./scripts/check_code_quality.sh
else
    echo "⚠️  check_code_quality.sh not found, running basic checks..."
    
    # Basic format check
    dart format --set-exit-if-changed lib/ test/
    
    # Basic analyze
    flutter analyze
    
    # Basic test
    flutter test
fi

echo "✅ Pre-commit checks passed!"
EOF

# Make the hook executable
chmod +x "$GIT_ROOT/.git/hooks/pre-commit"

# Create pre-push hook
cat > "$GIT_ROOT/.git/hooks/pre-push" << 'EOF'
#!/bin/bash

# Saiondo Flutter App - Pre-push Hook
# This hook runs additional checks before pushing

set -e

echo "🚀 Running pre-push checks..."

# Get the project root directory
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

# Run tests with coverage
echo "🧪 Running tests with coverage..."
flutter test --coverage

# Check test coverage threshold (optional)
# You can customize this threshold
COVERAGE_THRESHOLD=80
if command -v lcov &> /dev/null; then
    COVERAGE_PERCENT=$(lcov --summary coverage/lcov.info | grep "lines" | cut -d' ' -f4 | cut -d'%' -f1)
    if (( $(echo "$COVERAGE_PERCENT < $COVERAGE_THRESHOLD" | bc -l) )); then
        echo "❌ Test coverage is below $COVERAGE_THRESHOLD% (current: $COVERAGE_PERCENT%)"
        echo "Please add more tests before pushing."
        exit 1
    fi
    echo "✅ Test coverage: $COVERAGE_PERCENT%"
fi

echo "✅ Pre-push checks passed!"
EOF

# Make the hook executable
chmod +x "$GIT_ROOT/.git/hooks/pre-push"

# Create commit-msg hook for conventional commits
cat > "$GIT_ROOT/.git/hooks/commit-msg" << 'EOF'
#!/bin/bash

# Saiondo Flutter App - Commit Message Hook
# This hook validates commit message format

set -e

# Get the commit message
COMMIT_MSG=$(cat "$1")

# Conventional commit pattern
# Format: type(scope): description
# Types: feat, fix, docs, style, refactor, test, chore, etc.
PATTERN="^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+"

if [[ ! $COMMIT_MSG =~ $PATTERN ]]; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "Please use conventional commit format:"
    echo "  type(scope): description"
    echo ""
    echo "Examples:"
    echo "  feat: add new chat feature"
    echo "  fix(auth): resolve login issue"
    echo "  docs: update README"
    echo "  style: format code"
    echo "  refactor(api): improve error handling"
    echo "  test: add unit tests for user service"
    echo "  chore: update dependencies"
    echo ""
    echo "Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert"
    exit 1
fi

echo "✅ Commit message format is valid!"
EOF

# Make the hook executable
chmod +x "$GIT_ROOT/.git/hooks/commit-msg"

print_status "Git hooks setup completed!"

echo ""
echo "📋 Installed hooks:"
echo "  - pre-commit: Runs code quality checks before commit"
echo "  - pre-push: Runs tests with coverage before push"
echo "  - commit-msg: Validates commit message format"
echo ""
echo "💡 Tips:"
echo "  - Hooks will run automatically on git operations"
echo "  - To skip hooks temporarily: git commit --no-verify"
echo "  - To disable a hook: chmod -x .git/hooks/hook-name"
echo "  - Conventional commit format: type(scope): description" 