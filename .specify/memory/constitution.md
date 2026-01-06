# SSalonPick Admin Frontend Constitution

## Core Principles

### I. 단위 테스트 필수

**모든 비즈니스 로직은 테스트로 검증되어야 한다.**

테스트 없는 코드는 머지할 수 없다. 테스트는 코드의 동작을 문서화하고, 리팩토링 시 안전망이 된다.

### II. 타입 안전성

**모든 오류는 컴파일 타임에 잡아야 한다.**

런타임 오류를 방지하고, 코드 자체가 문서가 되도록 한다. API 타입은 openapi-typescript로 자동 생성하여 프론트-백엔드 계약을 보장한다.

### III. FSD 패턴 준수

**Feature-Sliced Design 구조를 따른다.**

각 레이어의 책임을 명확히 분리하고, 의존성 방향을 지킨다. entities는 단일 원천(SSOT)으로서 재사용되고, features는 유저 인터랙션과 비즈니스 로직을 담는다.

### IV. 코드 가독성

**처음 본 사람이 pages와 features만 봐도 비즈니스 로직을 파악할 수 있어야 한다.**

코드는 작성하는 시간보다 읽는 시간이 더 길다. 명확한 네이밍과 구조로 자체 문서화된 코드를 작성한다.

---

## Technical Stack

| Category     | Technology                  |
| ------------ | --------------------------- |
| Form         | React Hook Form + Zod       |
| API Types    | openapi-typescript          |
| UI           | Radix UI                    |
| Architecture | FSD (Feature-Sliced Design) |

---

## FSD Structure

```
shared/ui        → Radix 기반 디자인 시스템 (Presentation)

entities/model   → Zod 스키마, Type (단일 원천, SSOT)
entities/api     → GET 요청 (조회)
entities/config  → 상수

features/api     → POST, PUT, DELETE (유저 인터랙션)
features/model   → 비즈니스 로직
features/ui      → 도메인 로직 포함 컴포넌트

pages/           → Route 상수, 페이지 컴포넌트
```

---

## Governance

- **MAJOR**: 원칙 삭제 또는 근본적 변경
- **MINOR**: 원칙 추가 또는 확장
- **PATCH**: 명확화, 오타 수정

**Version**: 1.0.0 | **Created**: 2025-01-05
