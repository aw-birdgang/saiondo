# LangGraph Server 테스트 가이드

## 목차
1. [테스트 구조](#테스트-구조)
2. [테스트 설정](#테스트-설정)
3. [테스트 실행](#테스트-실행)
4. [테스트 작성 가이드](#테스트-작성-가이드)
5. [CI/CD 통합](#cicd-통합)

## 테스트 구조

### 테스트 계층 구조
```tree
tests/
├── __init__.py
├── conftest.py              # 테스트 공통 설정
├── test_tools.py            # 기본 도구 테스트
├── test_tools_integration.py # 통합 테스트
├── test_tools_performance.py # 성능 테스트
├── test_api_key.py          # API 키 관리 테스트
└── tools_test_report.py     # 테스트 결과 분석
```

### 테스트 종류별 설명

#### 1. 단위 테스트 (test_tools.py)
- 개별 도구 기능 테스트
- 계산기, 날씨, 뉴스 등 각 도구의 독립적인 테스트
- 에러 처리 및 예외 상황 테스트

#### 2. 통합 테스트 (test_tools_integration.py)
- 여러 도구의 연계 동작 테스트
- 전체 워크플로우 테스트
- 실제 사용 시나리오 기반 테스트

#### 3. 성능 테스트 (test_tools_performance.py)
- 응답 시간 측정
- 동시 요청 처리 성능
- 리소스 사용량 모니터링

#### 4. API 키 테스트 (test_api_key.py)
- API 키 검증
- 보안 설정 테스트
- 환경 변수 관리 테스트

## 테스트 설정

### conftest.py 설정
```python
# 주요 설정 항목
- 환경 변수 로드
- 테스트용 API 키 설정
- 비동기 이벤트 루프 설정
- 경로 설정
```

### 환경 설정

1. **필요한 패키지 설치**
```bash
pip install pytest pytest-asyncio pytest-cov
```

2. **환경 변수 설정**
```bash
cp .env.example .env.test
# .env.test 파일 편집
```

3. **테스트용 API 키 설정**
```bash
export WEATHER_API_KEY=test_key
export NEWS_API_KEY=test_key
```

## 테스트 실행

### 기본 실행 방법

1. **모든 테스트 실행**
```bash
pytest tests/ -v
```

2. **특정 종류의 테스트만 실행**
```bash
# 단위 테스트
pytest tests/test_tools.py -v

# 통합 테스트
pytest tests/test_tools_integration.py -v

# 성능 테스트
pytest tests/test_tools_performance.py -v
```

3. **커버리지 리포트 생성**
```bash
pytest --cov=app tests/ --cov-report=html
```

### 테스트 마커 사용

```python
@pytest.mark.asyncio      # 비동기 테스트
@pytest.mark.integration  # 통합 테스트
@pytest.mark.performance  # 성능 테스트
@pytest.mark.api         # API 테스트
```

## 테스트 작성 가이드

### 1. 테스트 케이스 명명 규칙
- test_로 시작
- 기능을 명확히 설명하는 이름 사용
- 테스트 목적을 이름에 포함

### 2. 테스트 구조
- Given (준비)
- When (실행)
- Then (검증)

### 3. 모의 객체 사용
- 외부 API 호출은 mock 사용
- 테스트 환경 격리
- 일관된 테스트 결과 보장

### 4. 비동기 테스트
- pytest-asyncio 사용
- 적절한 대기 시간 설정
- 리소스 정리 보장

## CI/CD 통합

### GitHub Actions 설정

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      - name: Run tests
        run: |
          pytest tests/ -v --cov=app
```

### 테스트 결과 분석

tools_test_report.py를 사용하여 테스트 결과를 분석할 수 있습니다:
```bash
pytest tests/ --json=report.json
python tools_test_report.py
```

# 가상환경 재설정
rm -rf venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt
pip install -r requirements-dev.txt

# 개발 모드로 패키지 설치
pip install -e .
