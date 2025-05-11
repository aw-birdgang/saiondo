# PostgreSQL 자주 쓰는 명령어 정리

## 1. 데이터베이스 접속

```bash
psql -U [유저명] -d [DB명] -h [호스트] -p [포트]
# 예시
psql -U postgres -d mydb
```

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

## 3. 데이터 조회/조작

```sql
SELECT * FROM [테이블명];         -- 테이블 전체 조회
INSERT INTO [테이블명] (...) VALUES (...); -- 데이터 삽입
UPDATE [테이블명] SET ... WHERE ...;       -- 데이터 수정
DELETE FROM [테이블명] WHERE ...;          -- 데이터 삭제
```

## 4. 기타 유용한 명령어

| 명령어         | 설명                        |
| -------------- | -------------------------- |
| \q             | psql 종료                  |
| \?             | psql 명령어 도움말         |
| \h [명령어]    | SQL 문법 도움말            |
| \x             | 결과를 가로/세로 전환      |
| \timing        | 쿼리 실행 시간 표시        |
| \set           | 변수 설정                  |

## 5. 테이블/시퀀스/인덱스 삭제

```sql
DROP TABLE [테이블명];
DROP SEQUENCE [시퀀스명];
DROP INDEX [인덱스명];
```

## 6. 권한 관련

```sql
GRANT ALL PRIVILEGES ON DATABASE [DB명] TO [유저명];
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO [유저명];
```

---

## 참고

- psql 프롬프트에서 `\?`로 더 많은 명령어를 확인할 수 있습니다.
- SQL 명령어는 세미콜론(;)으로 끝나야 실행됩니다.
```
