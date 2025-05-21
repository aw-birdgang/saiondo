#!/bin/bash

# 프로젝트 루트(backend/llm)에서 실행하세요

# 1. PYTHONPATH 환경변수 설정
export PYTHONPATH=src

# 2. 서버 실행 (포트/옵션은 필요에 따라 수정)
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
