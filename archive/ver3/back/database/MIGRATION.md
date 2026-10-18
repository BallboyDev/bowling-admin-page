# games 기반 성적 관리

출석은 이벤트에서 한 게임 이상 진행한 회원으로 계산한다. 0점은 유효한 게임이고, null 또는 미입력은 미참여다. 개인 게임(eventId = NULL)은 이벤트 통계에서 제외한다.

## 구조

- 점수 원본은 games에만 저장한다. 회원별 합계, 평균, 출석은 조회 시 계산한다.
- gameNumber는 이벤트의 원래 게임 번호다. 중간에 불참한 번호는 압축하지 않는다.
- 개인 기록 API의 sequence는 날짜별 표시 순서이므로 gameNumber와 다르다.
- events.eventId는 UNIQUE 인덱스로 보장한다.
- games의 (eventId, memberId, gameNumber)는 중복될 수 없다.
- games.recordId, games.records 및 records 테이블은 제거됐다.
- events.player는 이벤트 저장 시 유효한 게임이 있는 회원 수로 저장한다.

## API 호환성

- GET /api/events/:eventId는 기존 { eventInfo, records }를 유지한다. records는 계산된 성적표이며 DB 테이블 이름이 아니다.
- game1~game4는 미참여 시 null이다. game5 이상의 점수가 있으면 해당 필드를 추가한다. 합계와 평균은 모든 게임을 포함한다.
- POST /api/events/save는 기존 records 입력을 받는다. gameN: { score: number | null } 및 gameN: number | null 형식을 지원한다. N은 양의 정수다.
- name으로 회원을 확인하며 동명이인은 memberId로 지정해야 한다. 중복 회원, 유효하지 않은 점수, 게임이 전혀 없는 요청은 400이다.
- 저장 응답의 recordResult/gameResult 묶음은 유지하지만 삭제된 recordId는 반환하지 않는다. result.eventId를 추가했다.
- 삭제 응답 recordResult.changes는 삭제된 참가 회원 수다. records 테이블 삭제 결과가 아니다.
- POST /api/events/modify는 연결된 게임의 date와 center도 같은 트랜잭션으로 수정한다.
- GET /api/games/:memberId의 { games } 형식과 날짜별 sequence는 유지한다.
- GET /api/records는 제거됐다.
- 기존 프론트엔드의 4게임 표시 제한은 별도 작업이다. 백엔드는 5게임 이상을 보존하고 집계한다.

## 기존 DB 이관

1. 서버 및 nodemon 등 자동 재시작 프로세스를 중지한다. DB 편집기에서도 쓰기를 중단한다.
2. 현재 백엔드 코드를 백업한다. 이관 CLI는 SQLite 백업 API로 DB의 WAL 내용까지 백업한다.
3. 먼저 복사본에서 `npm run migrate:games -- /absolute/path/to/copy.db`를 실행하고 `npm test`를 통과시킨다.
4. 새 코드를 배치하고 `npm run migrate:games -- /absolute/path/to/app.db`를 실행한다.
5. 출력된 .bak 경로를 보관하고 서버를 재시작한다. 상세 조회, 통계, 게임 조회를 확인한다.

이관은 하나의 IMMEDIATE 트랜잭션으로 수행한다. recordId별 게임을 id 순으로 읽어 기존 game1~game6의 점수·개수·총점·평균과 대조한 후 번호를 부여한다. 불일치, 고아 데이터, 중복 이벤트, 예상하지 못한 컬럼·의존 객체는 중단 사유다. 게임 ID/원본 데이터/자동 증가 번호와 회원·이벤트 데이터는 보존한다. 실패하면 테이블 삭제를 포함해 전부 롤백한다. 이미 이관된 DB에 다시 실행해도 데이터를 중복 생성하지 않는다.

이전 DB를 새 서버가 자동으로 이관하지는 않는다. records가 있으면 시작을 거부하고 명시적 이관을 안내한다.

## 복구

서버와 DB 연결을 닫은 상태에서 이관 직전 백업 DB와 백업 코드를 함께 복구한다. WAL을 사용 중인 DB 위에 파일만 덮어쓰지 않는다. SQLite 백업 API를 이용해 복구하거나 모든 연결과 WAL 상태를 정리한 후 교체한다. 전환 후 새로 저장한 데이터가 있다면 먼저 별도 백업하고 병합 여부를 검토한다.

## 신규 DB와 과거 데이터

- `npm run init`: 새 DB를 만들거나 이미 새 구조인 DB를 확인한다. 기존 데이터를 초기화하지 않는다.
- 기본 DB 경로는 database/app.db이며 BOWLING_DB_PATH로 별도 파일을 지정할 수 있다.
- database/dump/reload_2026.sql은 기존 이벤트와 게임을 삭제하는 과거 자료 복원용 스크립트다. 운영 DB에서 초기화 용도로 실행하지 않는다. 기존 25명 회원 데이터가 있는 테스트 DB에서 검증한 결과는 회원 30명, 이벤트 27개, 게임 1,032개다.
- `npm test`: 메모리 DB에서 API 동작, 이관 보존, 실패 시 롤백을 검증한다. 운영 DB에 쓰지 않는다.
