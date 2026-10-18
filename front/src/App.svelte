<!-- https://docs.google.com/spreadsheets/d/15GnJsRufv5Q698JKGGnFh5ZHvqV1hIUo/edit?gid=38891430#gid=38891430 -->

<script>
  import {
    Button,
    Card,
    CardBody,
    Input,
    TabContent,
    TabPane,
  } from "@sveltestrap/sveltestrap";
  import MemberList from "./lib/MemberList.svelte";
  import EventScore from "./lib/EventScore.svelte";
  import PlayEvent from "./lib/PlayEvent.svelte";
  import ClubRecord from "./lib/ClubRecord.svelte";
  import PersonalRecord from "./lib/PersonalRecord.svelte";
  import Footer from "./lib/components/Footer.svelte";

  let selectedTab = $state("");

  const uid = $props.id();
  let name = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let loginMessage = $state("");

  const submitLogin = () => {
    if (!name.trim() || !password) {
      loginMessage = "이름과 비밀번호를 확인해 주세요.";
      return;
    }
    // Connect the authentication API here when it is available.
    loginMessage = "로그인 기능을 준비 중입니다.";
  };
</script>

<section class="m-3" aria-labelledby={`${uid}-main`}>
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 id={`${uid}-main`}>2026 개빡세 회원 점수관리</h3>
    <Button>관리자</Button>
  </div>

  <!-- <div>
    <TabContent
      on:tab={(e) => {
        selectedTab = `${e.detail}`;
      }}
    >
      <TabPane tabId="member" tab="회원관리">
        <MemberList />
      </TabPane>

      <TabPane tabId="scoreRecord" tab="클럽 기록">
        <ClubRecord selected={selectedTab === "scoreRecord"} />
      </TabPane>

      <TabPane tabId="personScore" tab="개인 기록" active>
        <PersonalRecord selected={selectedTab === "personScore"} />
      </TabPane>

      <TabPane tabId="event" tab="정기전">
        <EventScore selected={selectedTab === "event"} />
      </TabPane>

      <TabPane tabId="playGame" tab="정기전 진행">
        <PlayEvent />
      </TabPane>
    </TabContent>
  </div> -->

  <div class="d-flex justify-content-center py-4 py-md-5">
    <Card class="w-100 border-0 shadow-sm rounded-4" style="max-width: 24rem;">
      <CardBody class="p-4">
        <h2
          id={`${uid}-login-title`}
          class="h4 fw-bold text-center text-primary mb-4"
        >
          회원 로그인
        </h2>
        <form
          class="d-flex flex-column gap-3"
          aria-labelledby={`${uid}-login-title`}
          onsubmit={(event) => {
            event.preventDefault();
            submitLogin();
          }}
        >
          <div>
            <label for={`${uid}-name`} class="form-label fw-semibold small"
              >이름</label
            >
            <Input
              id={`${uid}-name`}
              name="username"
              bind:value={name}
              autocomplete="username"
              required
              placeholder="이름을 입력하세요"
              class="py-2"
              oninput={() => {
                loginMessage = "";
              }}
            />
          </div>
          <div>
            <label for={`${uid}-password`} class="form-label fw-semibold small"
              >비밀번호</label
            >
            <div class="input-group">
              <Input
                id={`${uid}-password`}
                name="password"
                type={showPassword ? "text" : "password"}
                bind:value={password}
                autocomplete="current-password"
                required
                placeholder="비밀번호를 입력하세요"
                class="py-2"
                oninput={() => {
                  loginMessage = "";
                }}
              />
              <Button
                type="button"
                color="secondary"
                outline
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                aria-controls={`${uid}-password`}
                aria-pressed={showPassword}
                onclick={() => {
                  showPassword = !showPassword;
                }}
              >
                {showPassword ? "숨기기" : "표시"}
              </Button>
            </div>
          </div>
          {#if loginMessage}<p
              class="small text-body-secondary mb-0"
              role="status"
            >
              {loginMessage}
            </p>{/if}
          <Button
            type="submit"
            color="primary"
            class="w-100 py-2 fw-semibold mt-1">로그인</Button
          >
        </form>
      </CardBody>
    </Card>
  </div>
</section>

<style>
  :global(.nav-tabs) {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    height: 2.5rem;
    white-space: nowrap;
    -ms-overflow-style: none;
  }
  :global(.nav-tabs)::-webkit-scrollbar {
    display: none;
  }
</style>
