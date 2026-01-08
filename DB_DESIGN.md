# 데이터베이스 설계

## 테이블 구조

### 1. `member` 테이블 (사용자)

사용자 정보를 저장하는 테이블입니다.

| 필드명     | 타입         | 제약조건                    | 설명                   |
| ---------- | ------------ | --------------------------- | ---------------------- |
| id         | INT          | PRIMARY KEY, AUTO_INCREMENT | 사용자 고유 ID         |
| email      | VARCHAR(255) | UNIQUE, NOT NULL            | 이메일                 |
| password   | VARCHAR(255) | NOT NULL                    | 암호화된 비밀번호      |
| created_at | TIMESTAMP    | NOT NULL                    | 생성일시               |
| updated_at | TIMESTAMP    | NOT NULL                    | 수정일시               |
| deleted_at | TIMESTAMP    | NULL                        | 삭제일시 (soft delete) |

**인덱스:**

```sql
CREATE UNIQUE INDEX uk_member_email ON member(email) WHERE deleted_at IS NULL;
```

---

### 2. `task` 테이블 (할 일 목록)

사용자가 추가한 할 일들을 저장하는 테이블입니다.

| 필드명       | 타입        | 제약조건                    | 설명                              |
| ------------ | ----------- | --------------------------- | --------------------------------- |
| id           | INT         | PRIMARY KEY, AUTO_INCREMENT | 할 일 고유 ID                     |
| member_id    | INT         | FOREIGN KEY, NOT NULL       | 사용자 ID (Member 테이블 참조)    |
| name         | VARCHAR(20) | NOT NULL                    | 할 일 이름 (최대 20자)            |
| start_time   | TIME        | NOT NULL                    | 시작 시간                         |
| end_time     | TIME        | NOT NULL                    | 끝낼 시간                         |
| target_date  | DATE        | NOT NULL                    | 대상 날짜 (어떤 날짜의 할 일인지) |
| is_completed | BOOLEAN     | DEFAULT FALSE               | 완료 여부                         |
| created_at   | TIMESTAMP   | NOT NULL                    | 생성일시                          |
| updated_at   | TIMESTAMP   | NOT NULL                    | 수정일시                          |
| deleted_at   | TIMESTAMP   | NULL                        | 삭제일시 (soft delete)            |

**설명:**

- `target_date`: 날짜별로 할 일을 관리하기 위한 필드
- `is_completed`: 완료하지 못한 일은 다음 날로 넘어가는 로직 구현에 사용
- `member_id`: 사용자별로 할 일을 관리
- `deleted_at`: soft delete를 통한 실수 복구 가능

**인덱스:**

```sql
CREATE INDEX idx_task_member_date ON task(member_id, target_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_completion ON task(target_date, is_completed) WHERE deleted_at IS NULL;
```

**제약조건:**

```sql
ALTER TABLE task ADD CONSTRAINT fk_task_member FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE;
ALTER TABLE task ADD CONSTRAINT chk_task_time CHECK (start_time < end_time);
```

---

### 3. `schedule` 테이블 (스케줄)

오늘 실행할 태스크를 최대 3개까지 지정하는 영역입니다.

| 필드명      | 타입        | 제약조건                    | 설명                              |
| ----------- | ----------- | --------------------------- | --------------------------------- |
| id          | INT         | PRIMARY KEY, AUTO_INCREMENT | 스케줄 고유 ID                    |
| member_id   | INT         | FOREIGN KEY, NOT NULL       | 사용자 ID (Member 테이블 참조)    |
| task_id     | INT         | FOREIGN KEY, NULL           | 할 일 ID (Task 테이블 참조, 선택) |
| name        | VARCHAR(20) | NOT NULL                    | 할 일 이름 (최대 20자)            |
| start_time  | TIME        | NOT NULL                    | 시작 시간                         |
| end_time    | TIME        | NOT NULL                    | 끝낼 시간                         |
| target_date | DATE        | NOT NULL                    | 대상 날짜                         |
| order       | TINYINT     | NOT NULL                    | 스케줄 순서 (1~3)                 |
| created_at  | TIMESTAMP   | NOT NULL                    | 생성일시                          |
| updated_at  | TIMESTAMP   | NOT NULL                    | 수정일시                          |
| deleted_at  | TIMESTAMP   | NULL                        | 삭제일시 (soft delete)            |

**설계 근거:**

- **시간 정보 비정규화**: 스케줄 등록 시 드래그앤드롭 모달에서 시간 수정이 가능하므로, 스케줄의 시간은 원본 task와 독립적으로 관리
- **1:1 관계**: 하나의 할 일(Task)은 최대 하나의 스케줄(Schedule)에만 참조될 수 있음 (할 일을 스케줄로 이동하는 개념)
- `task_id`: 원본 할 일 참조용 (NULL 허용, 스케줄만 독립적으로 생성 가능, UNIQUE 제약으로 1:1 관계 보장)
- `name`, `start_time`, `end_time`: 스케줄에서 수정 가능하므로 별도 저장
- `order`: 최대 3개까지이므로 순서 관리 (1, 2, 3)
- `target_date`: 날짜별로 스케줄을 관리
- `deleted_at`: soft delete를 통한 실수 복구 가능

**인덱스:**

```sql
CREATE INDEX idx_schedule_member_date ON schedule(member_id, target_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_schedule_task ON schedule(task_id) WHERE deleted_at IS NULL;
```

**제약조건:**

```sql
-- 같은 날짜, 같은 사용자의 동일 order 방지 (최대 3개 제한)
ALTER TABLE schedule ADD CONSTRAINT uk_schedule_order UNIQUE (member_id, target_date, order);

-- order 값은 1~3만 허용
ALTER TABLE schedule ADD CONSTRAINT chk_schedule_order CHECK (order BETWEEN 1 AND 3);

-- 시간 검증
ALTER TABLE schedule ADD CONSTRAINT chk_schedule_time CHECK (start_time < end_time);

-- FK 제약
ALTER TABLE schedule ADD CONSTRAINT fk_schedule_member FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE;
ALTER TABLE schedule ADD CONSTRAINT fk_schedule_task FOREIGN KEY (task_id) REFERENCES task(id) ON DELETE SET NULL;

-- 1:1 관계 보장: 하나의 Task는 하나의 Schedule에만 참조될 수 있음
ALTER TABLE schedule ADD CONSTRAINT uk_schedule_task UNIQUE (task_id);
```

---

### 4. `member_settings` 테이블 (사용자 설정)

스케줄의 시작 시간, 마무리 시간을 지정하는 설정입니다.

| 필드명              | 타입      | 제약조건                      | 설명                                     |
| ------------------- | --------- | ----------------------------- | ---------------------------------------- |
| id                  | INT       | PRIMARY KEY, AUTO_INCREMENT   | 설정 고유 ID                             |
| member_id           | INT       | FOREIGN KEY, NOT NULL, UNIQUE | 사용자 ID (Member 테이블 참조, 1:1 관계) |
| schedule_start_time | TIME      | NULL                          | 스케줄 시작 시간                         |
| schedule_end_time   | TIME      | NULL                          | 스케줄 마무리 시간                       |
| created_at          | TIMESTAMP | NOT NULL                      | 생성일시                                 |
| updated_at          | TIMESTAMP | NOT NULL                      | 수정일시                                 |

**설명:**

- `member_id`: UNIQUE 제약으로 사용자당 하나의 설정만 존재
- `schedule_start_time`, `schedule_end_time`: NULL 가능 (최초 설정 전에는 NULL)
- 최초 시간 설정을 안하면 홈화면 진입 불가 로직 구현에 사용

**제약조건:**

```sql
-- 사용자당 하나의 설정만 존재
ALTER TABLE member_settings ADD CONSTRAINT uk_member_settings_member UNIQUE (member_id);

-- 시간 검증 (둘 다 설정된 경우에만)
ALTER TABLE member_settings ADD CONSTRAINT chk_member_settings_time
  CHECK (
    (schedule_start_time IS NULL AND schedule_end_time IS NULL) OR
    (schedule_start_time IS NOT NULL AND schedule_end_time IS NOT NULL AND schedule_start_time < schedule_end_time)
  );

-- FK 제약
ALTER TABLE member_settings ADD CONSTRAINT fk_member_settings_member FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE;
```

---

## 관계도

```
Member (1) ──── (N) Task
Member (1) ──── (N) Schedule
Member (1) ──── (1) MemberSettings
Task (1) ──── (0..1) Schedule (task_id로 참조, 선택적, 1:1 관계)
```

**설명:**

- Member와 Task: 1:N (한 사용자가 여러 할 일 생성 가능)
- Member와 Schedule: 1:N (한 사용자가 여러 스케줄 생성 가능)
- Member와 MemberSettings: 1:1 (한 사용자당 하나의 설정)
- Task와 Schedule: 1:1 (하나의 할 일은 최대 하나의 스케줄에만 참조될 수 있음, 스케줄은 시간 정보를 독립적으로 가짐)

---

## 주요 비즈니스 로직

### 1. 할 일 → 스케줄 이동

할 일 목록의 할 일을 드래그앤드롭으로 스케줄에 추가합니다.

**프로세스:**

1. 사용자가 할 일을 스케줄로 드래그
2. 모달에서 할 일 이름, 시작 시간, 끝낼 시간 확인/수정
3. `schedule` 테이블에 새 레코드 생성:
   - `task_id`: 원본 할 일 ID (참조용)
   - `name`, `start_time`, `end_time`: 모달에서 확인/수정된 값 (독립적으로 저장)
   - `order`: 1~3 중 빈 자리에 할당

**SQL 예시:**

```sql
INSERT INTO schedule (member_id, task_id, name, start_time, end_time, target_date, order, created_at, updated_at)
SELECT
  :member_id,
  :task_id,
  :name,  -- 모달에서 수정 가능
  :start_time,  -- 모달에서 수정 가능
  :end_time,  -- 모달에서 수정 가능
  :target_date,
  (SELECT COALESCE(MIN(seq), 4) FROM (SELECT 1 AS seq UNION SELECT 2 UNION SELECT 3) AS numbers
   WHERE seq NOT IN (SELECT `order` FROM schedule WHERE member_id = :member_id AND target_date = :target_date AND deleted_at IS NULL)),
  NOW(),
  NOW();
```

---

### 2. 스케줄 → 할 일 목록 이동

스케줄을 드래그앤드롭으로 할 일 목록으로 이동합니다.

**프로세스:**

1. 사용자가 스케줄을 할 일 목록으로 드래그
2. `schedule` 레코드를 soft delete (deleted_at 설정)
3. 원본 `task`는 그대로 유지

**SQL 예시:**

```sql
UPDATE schedule
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = :schedule_id AND member_id = :member_id;
```

---

### 3. 완료하지 못한 일 다음 날로 넘어가기

오늘 완료하지 못한 할 일은 다음 날로 자동 이동됩니다.

**프로세스 (일일 배치 또는 날짜 변경 시 실행):**

1. 과거 날짜의 미완료 할 일 조회
2. `target_date`를 오늘로 업데이트

**SQL 예시:**

```sql
UPDATE task
SET target_date = CURRENT_DATE, updated_at = NOW()
WHERE target_date < CURRENT_DATE
  AND is_completed = FALSE
  AND deleted_at IS NULL;
```

**대안 - 이력 관리가 필요한 경우:**
원본 할 일은 유지하고 새로운 할 일로 복사

```sql
INSERT INTO task (member_id, name, start_time, end_time, target_date, is_completed, created_at, updated_at)
SELECT member_id, name, start_time, end_time, CURRENT_DATE, FALSE, NOW(), NOW()
FROM task
WHERE target_date < CURRENT_DATE
  AND is_completed = FALSE
  AND deleted_at IS NULL;

-- 원본은 완료 처리하여 이력 보존
UPDATE task
SET is_completed = TRUE, updated_at = NOW()
WHERE target_date < CURRENT_DATE
  AND is_completed = FALSE
  AND deleted_at IS NULL;
```

---

### 4. 스케줄 최대 3개 제한

같은 날짜, 같은 사용자에 대해 최대 3개의 스케줄만 허용합니다.

**검증 로직:**

- DB 제약: `UNIQUE (member_id, target_date, order)` + `CHECK (order BETWEEN 1 AND 3)`
- 애플리케이션 레벨: 스케줄 추가 전 개수 확인

**SQL 예시:**

```sql
-- 스케줄 개수 확인
SELECT COUNT(*) FROM schedule
WHERE member_id = :member_id
  AND target_date = :target_date
  AND deleted_at IS NULL;

-- 3개 미만일 때만 추가 허용
```

---

### 5. 할 일/스케줄 수정

바텀 시트에서 할 일 이름, 시작 시간, 끝낼 시간을 수정합니다.

**할 일 수정:**

```sql
UPDATE task
SET name = :name, start_time = :start_time, end_time = :end_time, updated_at = NOW()
WHERE id = :task_id AND member_id = :member_id;
```

**스케줄 수정:**

```sql
-- 스케줄의 시간 정보는 독립적이므로 schedule 테이블만 수정
UPDATE schedule
SET name = :name, start_time = :start_time, end_time = :end_time, updated_at = NOW()
WHERE id = :schedule_id AND member_id = :member_id;
```

---

### 6. 할 일/스케줄 삭제

**할 일 삭제 (soft delete):**

```sql
UPDATE task
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = :task_id AND member_id = :member_id;

-- 연관된 스케줄의 task_id를 NULL로 설정 (FK ON DELETE SET NULL)
```

**스케줄 삭제 (soft delete):**

```sql
UPDATE schedule
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = :schedule_id AND member_id = :member_id;
```

---

### 7. 날짜별 조회

특정 날짜의 할 일 목록과 스케줄을 조회합니다.

**할 일 목록 조회:**

```sql
SELECT * FROM task
WHERE member_id = :member_id
  AND target_date = :target_date
  AND deleted_at IS NULL
ORDER BY created_at DESC;
```

**스케줄 조회:**

```sql
SELECT * FROM schedule
WHERE member_id = :member_id
  AND target_date = :target_date
  AND deleted_at IS NULL
ORDER BY `order` ASC;
```

---

## 성능 최적화 고려사항

### 1. 인덱스 활용

- 모든 조회 쿼리는 `(member_id, target_date)` 복합 인덱스 활용
- soft delete를 고려한 필터 조건 인덱스 (WHERE deleted_at IS NULL)

### 2. 배치 작업

- "완료하지 못한 일 다음 날로 넘어가기"는 일일 배치 또는 사용자 첫 접속 시 실행
- 대량 업데이트는 트랜잭션으로 처리

### 3. 데이터 정합성

- FK 제약으로 참조 무결성 보장
- CHECK 제약으로 비즈니스 룰 DB 레벨 검증
- 애플리케이션 레벨에서도 이중 검증 권장
