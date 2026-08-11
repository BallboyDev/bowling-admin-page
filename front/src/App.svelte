<script>
  import { Button, TabContent, TabPane } from "@sveltestrap/sveltestrap";
  import MemberList from "./lib/MemberList.svelte";
  import GameScore from "./lib/GameScore.svelte";
  import PlayGame from "./lib/PlayGame.svelte";
</script>

<div class="m-3">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3>2026 개빡세 회원 점수관리</h3>
    <Button>관리자</Button>
  </div>

  <div>
    <TabContent>
      <TabPane tabId="member" tab="회원관리">
        <MemberList />
      </TabPane>
      <TabPane tabId="scoreRecord" tab="점수기록">
        <div>점수기록</div>
      </TabPane>
      <TabPane tabId="game" tab="정기전">
        <GameScore />
      </TabPane>
      <TabPane tabId="playGame" tab="정기전 진행" active>
        <PlayGame />
      </TabPane>
      <TabPane tabId="personScore" tab="개인 기록"></TabPane>
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
