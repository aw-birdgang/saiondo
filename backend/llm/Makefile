.PHONY: install format lint test clean help

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies and pre-commit hooks
	pip install -r requirements.txt
	pre-commit install

format: ## Format code with black and isort
	black src/
	isort src/

lint: ## Run linting checks
	flake8 src/
	black --check src/
	isort --check-only src/

test: ## Run tests
	PYTHONPATH=src pytest

clean: ## Clean up cache files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +

check: format lint test ## Run all checks
