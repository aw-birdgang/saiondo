# SAIONDO Dev 환경 인프라 및 배포 가이드

---

## 1. 프로젝트 구조 및 코드 분석 피드백

### 1.1. 디렉토리 구조

environments/dev/
├── alb.tf # ALB 모듈(비용절감시 제거)
├── codestar_connection.tf
├── ecr.tf
├── ecs.tf
├── instances.tf
├── lb.tf # LB 모듈(비용절감시 제거)
├── main.tf
├── output.tf
├── pipeline_app_api.tf
├── rds.tf
├── s3.tf
├── securitygroup.tf
├── terraform.tfvars
├── variables.tf
├── vpc.tf
├── backend.tf

### 1.2. 구조적 특징 및 장점

- **모듈화**: 대부분의 리소스가 `../../modules/` 하위 모듈로 관리되어 재사용성이 높음
- **환경 분리**: dev, prod 등 환경별 디렉토리로 IaC 관리
- **변수/출력**: `variables.tf`, `output.tf`로 파라미터화 및 결과값 관리
- **CI/CD**: `pipeline_app_api.tf`에서 파이프라인 리소스 관리
- **보안**: Security Group, IAM 등 별도 관리

### 1.3. 개선/주의점

- dev 환경에서 불필요한 리소스(ALB, LB 등)는 비용절감을 위해 제거 필요
- RDS 등 Free Tier 초과 시 비용 발생 주의
- 모듈 내부 코드(../../modules/...)도 주기적 점검 필요
- 보안 그룹, 퍼블릭 IP 등 dev 환경은 느슨하게, prod는 엄격하게 관리
- Terraform backend(상태 저장) 구성 확인 필요
- 불필요한 리소스(테스트 후 EC2, RDS 등) 즉시 삭제 권장
- 코드 변경 시 terraform plan/apply 전후로 항상 diff 확인

---

## 2. 개발자 배포 파이프라인 전체 흐름

### 2.1. 전체 순서

1. **개발자가 코드 작성 및 로컬 테스트**
2. **GitHub에 commit & push**
3. **GitHub → AWS Codestar Connection(Webhook) 트리거**
4. **AWS CodePipeline 실행**
5. **CodeBuild에서 빌드(Docker 이미지 생성 등)**
6. **ECR에 Docker 이미지 push**
7. **S3에 빌드 아티팩트 저장**
8. **CodeDeploy가 ECS 서비스에 새 이미지 배포**
9. **ECS 서비스가 새 컨테이너로 롤링 업데이트**
10. **배포 완료 후 상태 확인**

### 2.2. 상세 단계별 설명

#### 1. 코드 작성 및 로컬 테스트
- 소스코드(앱, 인프라 등) 작성
- 로컬에서 빌드/테스트 (예: `docker build`, `pytest`, `npm test` 등)

#### 2. GitHub에 commit & push
- `git add . && git commit -m "feat: ..."`
- `git push origin <branch>`

#### 3. GitHub → AWS Codestar Connection(Webhook) 트리거
- GitHub에서 PR/Push 발생 시 Codestar Connection이 AWS로 이벤트 전달

#### 4. AWS CodePipeline 실행
- 파이프라인이 자동으로 실행됨
- 소스 단계: GitHub에서 코드 pull

#### 5. CodeBuild에서 빌드(Docker 이미지 생성 등)
- Docker 이미지 빌드
- 테스트/정적 분석 등 실행
- 빌드 결과물(아티팩트) 생성

#### 6. ECR에 Docker 이미지 push
- 빌드된 이미지를 ECR(Elastic Container Registry)에 push

#### 7. S3에 빌드 아티팩트 저장
- 필요시 빌드 산출물(예: 배포 스크립트, 설정파일 등) S3에 저장

#### 8. CodeDeploy가 ECS 서비스에 새 이미지 배포
- CodeDeploy가 ECS 서비스의 Task Definition을 새 이미지로 업데이트
- ECS 서비스가 롤링 업데이트 방식으로 새 컨테이너 배포

#### 9. ECS 서비스가 새 컨테이너로 롤링 업데이트
- 무중단 배포(Blue/Green 또는 Rolling)로 새 버전 서비스 시작

#### 10. 배포 완료 후 상태 확인
- ECS 서비스, 로그, CloudWatch 등에서 정상 동작 확인

---

## 3. 개발자가 추가로 해야 할 작업/유의사항

- **GitHub Personal Access Token, AWS 자격증명 등 보안정보 관리**
  - Codestar Connection, CodeBuild 등에서 필요
- **ECR, S3, CodeBuild, CodePipeline, CodeDeploy 등 권한/리소스 사전 생성**
  - Terraform으로 관리 중이지만, IAM 권한 등 누락 여부 확인
- **Dockerfile, buildspec.yml 등 빌드/배포 스크립트 준비**
  - CodeBuild가 참조할 파일 필요
- **ECS Task Definition, 서비스 정의 최신화**
  - 새 이미지 태그 반영 등
- **Terraform 코드 변경 시**
  - `terraform plan` → 변경사항 확인
  - `terraform apply` → 실제 리소스 반영
- **배포 후 모니터링/롤백 전략 마련**
  - CloudWatch, ECS Events, Sentry 등 연동
  - 문제 발생 시 롤백 방법 숙지
- **비용 모니터링**
  - dev 환경은 Free Tier 내 사용, 불필요 리소스 즉시 삭제
- **보안 그룹, 퍼블릭 IP 등 보안 설정 주의**
  - dev는 느슨하게, prod는 엄격하게

---

## 4. 참고/팁

- **Terraform 코드 변경 시 항상 plan/apply로 인프라 최신화**
- **모듈 내부 코드도 주기적으로 점검**
- **불필요한 리소스는 즉시 삭제하여 비용 최소화**
- **prod 환경은 별도 관리, dev와 보안/스펙/비용 정책 분리**

---

> 추가로 궁금한 점(예: buildspec.yml 예시, ECS Task Definition 샘플, 모듈 내부 구조 등)이 있으면 언제든 문의하세요!

