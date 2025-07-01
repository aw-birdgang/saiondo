# PostgreSQL 실무 명령어 & 운영 팁 (Saiondo 프로젝트 기준)

Saiondo 프로젝트는 **PostgreSQL**을 주요 데이터베이스로 사용합니다.  
아래는 실무에서 자주 쓰는 명령어, 운영/개발 환경에서 유용한 팁, 그리고 프로젝트에서 실제로 활용되는 패턴을 정리한 가이드입니다.

---

## 1. 데이터베이스 접속

```bash
psql -U [유저명] -d [DB명] -h [호스트] -p [포트]
# 예시 (로컬 개발)
psql -U postgres -d saiondo_dev
# 예시 (Docker 컨테이너 내부)
docker exec -it [컨테이너명] psql -U postgres -d saiondo_dev
```

---

## 2. 데이터베이스/테이블/스키마 정보

| 명령어         | 설명                        |
| -------------- | -------------------------- |
| \l             | 데이터베이스 목록 보기      |
| \c [DB명]      | DB 접속/변경               |
| \dt            | 테이블 목록 보기           |
| \d [테이블명]  | 테이블 구조(DDL) 보기      |
| \dn            | 스키마 목록 보기           |
| \df            | 함수 목록 보기             |
| \dv            | 뷰(View) 목록 보기         |
| \di            | 인덱스 목록 보기           |
| \du            | 유저(롤) 목록 보기         |
| \ds            | 시퀀스 목록 보기           |

---

## 3. 데이터 조회/조작

```sql
SELECT * FROM [테이블명];         -- 테이블 전체 조회
SELECT COUNT(*) FROM [테이블명];  -- 행 개수 세기
INSERT INTO [테이블명] (...) VALUES (...); -- 데이터 삽입
UPDATE [테이블명] SET ... WHERE ...;       -- 데이터 수정
DELETE FROM [테이블명] WHERE ...;          -- 데이터 삭제
```

---

## 4. 기타 유용한 명령어

| 명령어         | 설명                        |
| -------------- | -------------------------- |
| \q             | psql 종료                  |
| \?             | psql 명령어 도움말         |
| \h [명령어]    | SQL 문법 도움말            |
| \x             | 결과를 가로/세로 전환      |
| \timing        | 쿼리 실행 시간 표시        |
| \set           | 변수 설정                  |
| \password      | 비밀번호 변경              |

---

## 5. 테이블/시퀀스/인덱스 삭제

```sql
DROP TABLE [테이블명] CASCADE;    -- 의존 객체까지 삭제
DROP SEQUENCE [시퀀스명];
DROP INDEX [인덱스명];
```

---

## 6. 권한 및 계정 관리

```sql
-- DB 권한 부여
GRANT ALL PRIVILEGES ON DATABASE [DB명] TO [유저명];
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO [유저명];

-- 새 유저 생성 및 비밀번호 설정
CREATE USER [유저명] WITH PASSWORD '[비밀번호]';

-- 슈퍼유저 권한 부여 (운영 환경에서는 주의)
ALTER USER [유저명] WITH SUPERUSER;
```

---

## 7. 개발/운영 환경에서 자주 쓰는 팁

- **마이그레이션**:  
  - NestJS(Prisma) 또는 TypeORM, Django 등 ORM을 쓸 경우, 마이그레이션 명령어를 통해 스키마 관리  
  - 예시: `npx prisma migrate dev`  
- **백업/복원**:  
  - 백업: `pg_dump -U [유저명] -d [DB명] > backup.sql`
  - 복원: `psql -U [유저명] -d [DB명] < backup.sql`
- **Docker 환경**:  
  - `docker-compose exec db psql -U postgres -d saiondo_dev`
- **실행 중 쿼리 확인**:  
  - `SELECT * FROM pg_stat_activity;`
- **DB 연결 정보 확인**:  
  - `.env` 또는 `config` 파일 참고 (예: `DATABASE_URL=postgresql://...`)

---

## 8. 트러블슈팅 & 참고

- **포트 충돌**: 기본 포트(5432) 사용 중이면 docker-compose에서 포트 변경
- **접속 거부**:  
  - `pg_hba.conf`/`postgresql.conf` 설정 확인
  - 방화벽/네트워크 정책 확인
- **대용량 데이터 처리**:  
  - `COPY` 명령어로 대량 데이터 import/export  
    - 예시: `COPY [테이블명] FROM '/경로/파일.csv' DELIMITER ',' CSV HEADER;`
- **SQL 명령어는 세미콜론(;)으로 끝나야 실행됩니다.**

---

## 참고

- psql 프롬프트에서 `\?`로 더 많은 명령어를 확인할 수 있습니다.
- 공식 문서: [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- ORM/마이그레이션 도구별 명령어는 각 모듈의 README 참고
