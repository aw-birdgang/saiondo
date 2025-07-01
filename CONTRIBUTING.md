# Contributing to Saiondo

Saiondo 프로젝트에 관심을 가져주셔서 감사합니다!  
이 프로젝트는 **AI 기반 커플 케어 서비스**로, 백엔드(API/LLM), 프론트엔드(Flutter), 인프라(Terraform), Web3 등 다양한 모듈로 구성되어 있습니다.  
아래 가이드라인을 따라주시면 원활한 협업과 품질 유지에 큰 도움이 됩니다.

## 📝 이슈/버그 제보

- [Issues](https://github.com/your-repo/issues) 탭에서 새 이슈를 등록해주세요.
- **유형**(버그, 개선, 질문 등)을 명확히 구분해주세요.
- **재현 방법, 기대 동작, 실제 동작, 로그/스크린샷** 등 최대한 상세히 작성해주세요.
- 각 모듈별 이슈는 `[backend]`, `[frontend]`, `[infra]`, `[web3]` 등 prefix를 붙여주세요.

## 🚀 기능 제안

- 새로운 기능/아이디어는 Issue로 먼저 제안해주세요.
- 팀과 논의 후 Pull Request를 생성해주세요.
- **중복 제안**이 없는지 기존 이슈를 먼저 검색해주세요.

## 💻 Pull Request(PR) 가이드

1. **Fork & Branch**
   - 저장소를 Fork하고, `feature/`, `fix/`, `docs/` 등 prefix로 브랜치를 생성하세요.
   - 예시: `feature/llm-chat-improvement`, `fix/frontend-login-bug`
2. **커밋 메시지**
   - 명확하고 일관된 커밋 메시지를 작성해주세요.
   - 예시: `fix: 로그인 오류 수정`, `feat: 대화 분석 기능 추가`
3. **PR 작성**
   - 변경 요약, 관련 이슈, 테스트 방법, 영향받는 모듈 등을 상세히 작성해주세요.
   - 리뷰어가 이해하기 쉽도록 설명을 추가해주세요.
4. **코드 스타일**
   - 각 언어/프레임워크의 컨벤션을 준수해주세요.
   - Lint, Test를 통과한 코드만 PR로 제출해주세요.
   - Flutter: `flutter format .` / `flutter analyze`
   - Node.js: `yarn lint` / `yarn test`
   - Python: `black .` / `pytest`
5. **문서화**
   - 주요 변경점, 신규 기능, 환경변수 등은 해당 모듈의 `README.md` 또는 `/docs/`에 문서화해주세요.

## 🧑‍💻 코드 스타일 & 폴더 구조

- 네이밍, 들여쓰기, 주석 등은 각 언어/프레임워크의 컨벤션을 따릅니다.
- **공통 스타일 가이드**는 `/docs/styleguide.md` (추후 작성 예정) 참고.
- 각 모듈별 문서:
  - 백엔드: `/backend/llm/README.md`, `/backend/api/README.md`
  - 프론트엔드: `/frontend/app/README.md`
  - 인프라: `/infrastructure/README.md`, `/infrastructure/terraform/README.md`
  - Web3: `/web3/README.md`

## 📄 문서 및 참고자료

- **개발/배포/운영 가이드**: `/docs/` 폴더 및 각 모듈의 `docs/` 참고
- **실행/빌드 가이드**: 각 모듈의 `README.md` 참고
- **자주 묻는 질문**: `/docs/faq.md` (추후 작성 예정)
- **아키텍처/설계**: `/docs/architecture.md` (추후 작성 예정)

## 🙏 기타

- 모든 기여자는 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)를 준수해야 합니다.
- 궁금한 점은 Issue 또는 Discussions에 남겨주세요.
- **보안 이슈**는 공개 이슈 대신 maintainer에게 직접 연락해주세요.

감사합니다!
