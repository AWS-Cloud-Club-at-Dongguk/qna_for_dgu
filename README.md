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

```
slido-for-dgu/
├── src/                          # 소스 코드 디렉터리
│   ├── index.js                  # Lambda 엔트리 포인트 (HTTP/WebSocket 핸들러)
│   ├── handlers/                 # 기능별 핸들러 함수들
│   │   ├── roomHandler.js        # 방 생성/관리 관련 핸들러
│   │   ├── questionHandler.js    # 질문 제출/관리 관련 핸들러
│   │   └── websocketHandler.js   # WebSocket 연결/메시지 핸들러
│   ├── models/                   # 데이터 모델 정의
│   │   └── index.js              # Room, Question, Connection 모델
│   ├── utils/                    # 유틸리티 함수들
│   │   └── helpers.js            # 응답 생성, 검증, 로깅 헬퍼
│   └── config/                   # 설정 파일
│       └── index.js              # AWS 리전, 테이블명, CORS 설정
├── serverless.yml                # Serverless Framework 배포 설정
├── package.json                  # Node.js 프로젝트 설정 (ESM 기반)
├── .gitignore                    # Git 무시 파일 설정
└── README.md                     # 프로젝트 문서
```

### 🏗️ 아키텍처 특징

- **ESM 기반**: `package.json`에서 `"type": "module"` 설정으로 최신 ES6 모듈 시스템 사용
- **엔트리 함수 분리**: HTTP API와 WebSocket API를 위한 별도 핸들러 함수
- **핸들러 분리**: 기능별로 독립적인 핸들러 파일 구조
- **DynamoDB 통합**: AWS SDK v3를 사용한 최적화된 데이터베이스 연동
- **Serverless Framework**: 인프라를 코드로 관리하는 IaC 방식

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