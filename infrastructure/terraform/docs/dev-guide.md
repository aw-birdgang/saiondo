# 🚀 SAIONDO Dev 환경 인프라 및 배포 가이드

이 문서는 **SAIONDO 개발 환경**의 인프라 구조, IaC(Terraform) 관리,  
CI/CD 파이프라인, 실전 운영 팁을 종합적으로 안내합니다.

---

## 📁 1. 프로젝트 구조 및 코드 분석

### 1.1. 디렉토리 구조

```plaintext
environments/dev/
├── alb.tf                  # ALB 모듈(비용절감시 제거)
├── codestar_connection.tf  # GitHub 연동
├── ecr.tf                  # 컨테이너 레지스트리
├── ecs.tf                  # ECS 클러스터/서비스
├── instances.tf            # EC2 인스턴스(옵션)
├── lb.tf                   # LB 모듈(비용절감시 제거)
├── main.tf                 # 메인 엔트리
├── output.tf               # 출력 변수
├── pipeline_app_api.tf     # CI/CD 파이프라인
├── rds.tf                  # RDS (DB)
├── s3.tf                   # S3 버킷
├── securitygroup.tf        # 보안 그룹
├── terraform.tfvars        # 환경별 변수값
├── variables.tf            # 변수 정의
├── vpc.tf                  # 네트워크
├── backend.tf              # 상태 저장(backend)
```

### 1.2. 구조적 특징 및 장점

- **모듈화**: 대부분의 리소스가 `../../modules/` 하위 모듈로 관리되어 재사용성/유지보수 용이
- **환경 분리**: dev, prod 등 환경별 디렉토리로 IaC 관리
- **변수/출력**: `variables.tf`, `output.tf`로 파라미터화 및 결과값 관리
- **CI/CD**: `pipeline_app_api.tf`에서 파이프라인 리소스 관리
- **보안**: Security Group, IAM 등 별도 관리로 보안 정책 분리

### 1.3. 개선/주의점

- dev 환경에서 **불필요한 리소스(ALB, LB 등)**는 비용절감을 위해 제거 권장
- RDS 등 Free Tier 초과 시 비용 발생 주의
- 모듈 내부 코드(../../modules/...)도 주기적 점검 필요
- **보안 그룹, 퍼블릭 IP 등**: dev는 느슨하게, prod는 엄격하게 관리
- **Terraform backend(상태 저장)** 구성 확인(공유/충돌 방지)
- 불필요한 리소스(테스트 후 EC2, RDS 등) 즉시 삭제 권장
- 코드 변경 시 `terraform plan/apply` 전후로 항상 diff 확인

---

## 🔄 2. 개발자 배포 파이프라인 전체 흐름

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

| 단계 | 설명 |
|------|------|
| 1 | 소스코드(앱, 인프라 등) 작성, 로컬에서 빌드/테스트 (`docker build`, `pytest`, `npm test` 등) |
| 2 | `git add . && git commit -m "feat: ..."` → `git push origin <branch>` |
| 3 | GitHub에서 PR/Push 발생 시 Codestar Connection이 AWS로 이벤트 전달 |
| 4 | AWS CodePipeline이 자동 실행, 소스 단계에서 GitHub 코드 pull |
| 5 | CodeBuild에서 Docker 이미지 빌드, 테스트/정적 분석, 빌드 결과물 생성 |
| 6 | 빌드된 이미지를 ECR(Elastic Container Registry)에 push |
| 7 | 필요시 빌드 산출물(S3) 저장 |
| 8 | CodeDeploy가 ECS 서비스의 Task Definition을 새 이미지로 업데이트 |
| 9 | ECS 서비스가 롤링 업데이트 방식으로 새 컨테이너 배포(무중단) |
| 10 | ECS 서비스, 로그, CloudWatch 등에서 정상 동작 확인 |

---

## 🛠️ 3. 개발자가 추가로 해야 할 작업/유의사항

- **보안정보 관리**:  
  - GitHub Personal Access Token, AWS 자격증명 등은 환경변수/시크릿으로 안전하게 관리
- **AWS 리소스 사전 준비**:  
  - ECR, S3, CodeBuild, CodePipeline, CodeDeploy 등 권한/리소스 사전 생성(필요시 Terraform으로)
- **빌드/배포 스크립트 준비**:  
  - Dockerfile, buildspec.yml 등 CodeBuild가 참조할 파일 준비
- **ECS Task Definition, 서비스 정의 최신화**:  
  - 새 이미지 태그 반영 등
- **Terraform 코드 변경 시**:  
  - `terraform plan` → 변경사항 확인  
  - `terraform apply` → 실제 리소스 반영
- **배포 후 모니터링/롤백 전략 마련**:  
  - CloudWatch, ECS Events, Sentry 등 연동  
  - 문제 발생 시 롤백 방법 숙지
- **비용 모니터링**:  
  - dev 환경은 Free Tier 내 사용, 불필요 리소스 즉시 삭제
- **보안 그룹, 퍼블릭 IP 등 보안 설정 주의**:  
  - dev는 느슨하게, prod는 엄격하게

---

## 💡 4. 실전 운영/개발 팁 & 참고

- **Terraform 코드 변경 시 항상 plan → apply로 인프라 최신화**
- **모듈 내부 코드도 주기적으로 점검**
- **불필요한 리소스는 즉시 삭제하여 비용 최소화**
- **prod 환경은 별도 관리, dev와 보안/스펙/비용 정책 분리**
- **Terraform backend(상태 저장) S3/DynamoDB 등으로 구성 권장**
- **코드 리뷰/PR 시 인프라 변경 diff 꼼꼼히 확인**
- **CloudWatch, Sentry 등 모니터링/알림 연동**
- **buildspec.yml, Dockerfile, ECS Task Definition 등 샘플은 별도 docs/ 참고**

---

## 📚 참고/문서

- [Terraform 공식 문서](https://www.terraform.io/docs/)
- [AWS ECS 공식 문서](https://docs.aws.amazon.com/ecs/latest/developerguide/what-is-ecs.html)
- [AWS CodePipeline 공식 문서](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [AWS CodeBuild 공식 문서](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [AWS ECR 공식 문서](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)
- [AWS S3 공식 문서](https://docs.aws.amazon.com/s3/index.html)
- [AWS RDS 공식 문서](https://docs.aws.amazon.com/rds/index.html)

---
