# Saiondo Flutter App - Makefile
# Provides convenient commands for development

.PHONY: help install format analyze test test-coverage clean build-web build-android build-ios setup-hooks check-quality run-dev run-prod

# Default target
help:
	@echo "🚀 Saiondo Flutter App - Available Commands"
	@echo ""
	@echo "📦 Setup & Installation:"
	@echo "  install        Install dependencies"
	@echo "  setup-hooks    Setup git hooks for code quality"
	@echo ""
	@echo "🔍 Code Quality:"
	@echo "  format         Format all Dart code"
	@echo "  analyze        Run static analysis"
	@echo "  check-quality  Run comprehensive code quality checks"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  test           Run all tests"
	@echo "  test-coverage  Run tests with coverage report"
	@echo ""
	@echo "🏃‍♂️ Running:"
	@echo "  run-dev        Run app in development mode"
	@echo "  run-prod       Run app in production mode"
	@echo ""
	@echo "🏗️ Building:"
	@echo "  build-web      Build for web"
	@echo "  build-android  Build for Android"
	@echo "  build-ios      Build for iOS"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean          Clean build artifacts"
	@echo "  codegen        Generate code (build_runner)"
	@echo ""

# Setup & Installation
install:
	@echo "📦 Installing dependencies..."
	flutter pub get
	@echo "✅ Dependencies installed!"

setup-hooks:
	@echo "🔧 Setting up git hooks..."
	@chmod +x scripts/setup_git_hooks.sh
	./scripts/setup_git_hooks.sh

# Code Quality
format:
	@echo "🎨 Formatting code..."
	@chmod +x scripts/format_code.sh
	./scripts/format_code.sh

analyze:
	@echo "🔍 Running static analysis..."
	flutter analyze

check-quality:
	@echo "🔍 Running comprehensive code quality checks..."
	@chmod +x scripts/check_code_quality.sh
	./scripts/check_code_quality.sh

# Testing
test:
	@echo "🧪 Running tests..."
	@chmod +x scripts/run_tests.sh
	./scripts/run_tests.sh

test-coverage:
	@echo "📊 Running tests with coverage..."
	@chmod +x scripts/run_tests.sh
	./scripts/run_tests.sh --coverage

# Running
run-dev:
	@echo "🚀 Running app in development mode..."
	flutter run --flavor development

run-prod:
	@echo "🚀 Running app in production mode..."
	flutter run --flavor production

# Building
build-web:
	@echo "🌐 Building for web..."
	flutter build web
	@echo "✅ Web build completed!"

build-android:
	@echo "🤖 Building for Android..."
	flutter build apk --release
	@echo "✅ Android build completed!"

build-ios:
	@echo "🍎 Building for iOS..."
	flutter build ios --release
	@echo "✅ iOS build completed!"

# Maintenance
clean:
	@echo "🧹 Cleaning build artifacts..."
	flutter clean
	flutter pub get
	@echo "✅ Clean completed!"

codegen:
	@echo "🔧 Generating code..."
	flutter pub run build_runner build --delete-conflicting-outputs
	@echo "✅ Code generation completed!"

# Pre-commit workflow
pre-commit: format analyze test
	@echo "✅ Pre-commit checks completed!"

# CI/CD workflow
ci: install check-quality test-coverage
	@echo "✅ CI checks completed!"

# Development workflow
dev-setup: install setup-hooks
	@echo "✅ Development setup completed!"

# Quick development cycle
dev-cycle: format analyze test
	@echo "✅ Development cycle completed!" 