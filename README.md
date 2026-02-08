# 볼링 동호회 관리 페이지 (Version 2)

이 프로젝트는 Svelte와 Vite를 사용하여 구축된 볼링 동호회 관리자 페이지입니다. 회원 정보, 정기전 점수, 개인 기록, 이벤트(내기) 등을 효과적으로 관리하기 위해 만들어졌습니다.

## 🛠️ 기술 스택 상세

-   **Frontend**:
    -   **Svelte**: UI를 위한 반응형(Reactive) 컴포넌트를 구축하는 데 사용되는 메인 프레임워크입니다.
    -   **Vite**: 빠른 개발 서버 구동과 최적화된 프로덕션 빌드를 위한 모던 웹 개발 빌드 도구입니다.
-   **UI Framework**:
    -   **Sveltestrap**: 반응형 및 모던 UI를 손쉽게 구현하기 위해 Svelte용으로 포팅된 Bootstrap 5 컴포넌트 라이브러리입니다.
-   **Backend & Database**:
    -   **Google Apps Script**: 별도의 서버 없이 백엔드 로직을 실행하는 서버리스 플랫폼입니다. 프론트엔드와 Google Sheets 간의 REST API 역할을 수행합니다.
    -   **Google Sheets**: 애플리케이션의 모든 데이터를 저장하는 데이터베이스로 사용됩니다.
-   **Languages**:
    -   **TypeScript**: 백엔드 통신 모듈(`gas.ts`)에 적용하여 타입 안정성을 확보합니다.
    -   **JavaScript (ES6+)**: 프론트엔드의 주요 로직을 작성하는 데 사용됩니다.

## ✨ 주요 기능 상세

### 회원 관리 (`/memberAdmin`)

-   **회원 목록 조회 (`Member.svelte`)**: 전체 회원의 목록을 확인합니다.
-   **회원 추가 (`AddMember.svelte`)**: 새로운 회원을 시스템에 등록합니다.
-   **회원 정보 상세 및 수정 (`InfoMember.svelte`)**: 특정 회원의 상세 정보를 조회하고 수정합니다.
-   **정기전 참여 이력 (`RegularGame.svelte`)**: 특정 회원이 참여한 정기전 목록을 관리합니다.

### 정기전 관리 (`/regularGame`)

-   **정기전 목록 조회 (`Game.svelte`)**: 모든 정기전 목록을 확인합니다.
-   **정기전 생성 및 수정 (`UpsertGame.svelte`)**: 정기전의 날짜, 장소 등 기본 정보를 생성하거나 수정합니다.
-   **점수 입력 (`InputColumn.svelte`)**: 특정 게임의 참가자와 각 게임별 점수를 입력 및 수정합니다.

### 개인 기록 (`/personalRecord`)

-   **개인 기록 조회 (`Person.svelte`)**: 특정 회원을 선택하여 개인 에버리지, 최고/최저 점수, 총 게임 참여 횟수 등 다양한 통계 정보를 조회합니다.

### 내기 관리 (`/betting`)

-   **내기 이벤트 관리 (`Betting.svelte`)**: 특정 이벤트(내기)를 생성하고 관리합니다.
-   **참여자 관리 (`Joiner.svelte`)**: 내기 이벤트에 참여하는 인원을 관리합니다.
-   **상품 관리 (`Prize.svelte`)**: 내기에 걸린 상품 정보를 등록하고 관리합니다.

## 📂 프로젝트 구조 상세

```
src/
├── App.svelte       # 애플리케이션의 최상위 루트 컴포넌트
├── main.js          # Svelte 앱을 초기화하고 DOM에 마운트하는 진입점
├── assets/          # 이미지, 폰트 등 정적 에셋
└── lib/             # 핵심 소스 코드가 위치하는 메인 디렉토리
    ├── betting/     # 내기 관리 기능 관련 컴포넌트
    ├── common/      # 여러 페이지에서 공통으로 사용되는 컴포넌트 (예: PageTitle)
    ├── develop/     # 개발 및 테스트용 컴포넌트
    ├── gas/
    │   └── gas.ts   # Google Apps Script 백엔드와 통신하는 API 클라이언트 모듈
    ├── memberAdmin/ # 회원 관리 기능 관련 컴포넌트
    ├── personalRecord/ # 개인 기록 조회 기능 관련 컴포넌트
    ├── regularGame/  # 정기전 관리 기능 관련 컴포넌트
    └── state/
        └── state.svelte.ts # 애플리케이션의 전역 상태를 관리하는 스토어
```

## 🚀 시작하기

### 사전 준비

1.  **Backend 설정**: Google Apps Script 프로젝트를 배포하고, 해당 URL을 `src/lib/gas/gas.ts` 파일의 `GAS_URL` 변수에 설정해야 합니다.
2.  **의존성 설치**: `npm install`

### 실행 및 빌드

-   개발 서버 실행: `npm run dev`
-   프로덕션 빌드: `npm run build`
-   빌드 결과 미리보기: `npm run preview`



## 수정/개선 사항
1. 계정별 권한 시스템
1. 점수 입력의 자동화 방안 (이미지 분석 기능)
1. 클럽 통합 데이터 관리 방안
1. 구글 시트 데이터 포인터 관리 방안 고민
1. 회원관리 - 회원정보 수정 시 로딩 페이지가 늦게 발생함
1. 이미지 분석 - 사진 촬영시 데이터 입력 기능