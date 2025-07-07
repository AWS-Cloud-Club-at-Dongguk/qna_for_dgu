# Slido_For_DGU

**AWS Lambda 기반의 실시간 Q&A 플랫폼 (Slido 클론)**  
방 생성, 익명 질문 등을 포함하는 개인 프로젝트입니다.
AWS Cloud Clubs DGU에서 사용

---

## 🔧 기술 스택

### 💻 프론트엔드
- **Vite + React**
- **TypeScript**
- **Tailwind CSS**

### ☁️ 백엔드
- **AWS Lambda (Node.js)**
- **API Gateway (WebSocket + HTTP)**
- **DynamoDB**
- **IAM / CloudWatch / S3**

---

## 📌 주요 기능

| 기능 | 설명 |
|------|------|
| 질문 등록 | 익명 질문 작성 |
| 관리자 기능 | 방 생성 |

Discord Trigger를 통해 방을 생성하고, 일정 시간이 지나면 제거됩니다.

---

## 📁 프로젝트 구조

## Commit Convention

| Type       | Description                      |
|------------|----------------------------------|
| `feat`     | 새로운 기능 추가                |
| `fix`      | 버그 수정                        |
| `design`   | CSS 등 사용자 UI 디자인 변경     |
| `!HOTFIX`  | 급한 변경                        |
| `refactor` | 프로덕션 코드 리팩토링          |
| `docs`     | 문서 작성 및 수정                |
| `test`     | 테스트 추가 및 리팩토링          |
| `setting`  | 패키지 설치 등 개발 환경 설정    |

## Commit Content Convention
ex) feat: ~~~ (#1)
## PR Convention
ex) feat: ~~~
## Branch Convention
ex) feat/25-branch-name