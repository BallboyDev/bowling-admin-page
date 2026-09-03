<!-- https://docs.google.com/spreadsheets/d/15GnJsRufv5Q698JKGGnFh5ZHvqV1hIUo/edit?gid=38891430#gid=38891430 -->

<script>
  import { Button, TabContent, TabPane } from "@sveltestrap/sveltestrap";
  import MemberList from "./lib/MemberList.svelte";
  import EventScore from "./lib/EventScore.svelte";
  import PlayEvent from "./lib/PlayEvent.svelte";
  import ClubRecord from "./lib/ClubRecord.svelte";

  let selectedTab = $state("");
</script>

<div class="m-3">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>2026 개빡세 회원 점수관리</h3>
    <Button>관리자</Button>
  </div>

  <div>
    <TabContent
      on:tab={(e) => {
        selectedTab = `${e.detail}`;
      }}
    >
      <TabPane tabId="member" tab="회원관리">
        <MemberList />
      </TabPane>
      <TabPane tabId="scoreRecord" tab="클럽 기록">
        <ClubRecord />
      </TabPane>
      <TabPane tabId="personScore" tab="개인 기록"></TabPane>
      <TabPane tabId="event" tab="정기전" active>
        <EventScore selected={selectedTab === "event"} />
      </TabPane>
      <TabPane tabId="playGame" tab="정기전 진행">
        <PlayEvent />
      </TabPane>
    </TabContent>
  </div>
</div>

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
