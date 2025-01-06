<script>
    const member = ["member1", "member2", "member3"];
    const days = new Array(31);
</script>

<h1 class="month">1월</h1>
<hr />

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>test</th>
                {#each days as day, i}
                    <th>{i + 1}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each member as name}
                <tr>
                    <td>{name}</td>
                    {#each days as day, i}
                        <td>{i + 1}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        width: 100%; /* 전체 테이블 너비 */
        overflow-x: auto; /* 가로 스크롤 활성화 */
    }

    table {
        width: 100%; /* 테이블의 기본 너비 */
        border-collapse: collapse; /* 테두리 중첩 제거 */
    }

    thead th {
        position: sticky;
        top: 0; /* 헤더를 고정 */
        background-color: #f1f1f1;
        z-index: 1;
    }

    th,
    td {
        padding: 10px;
        text-align: left;
        border: 1px solid #ddd; /* 셀 구분선 */
        white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    }

    tbody {
        display: block; /* tbody를 블록 요소로 설정 */
        overflow-x: auto; /* 가로 스크롤 활성화 */
        white-space: nowrap; /* 셀 내용 줄바꿈 방지 */
    }

    tr {
        display: table; /* 행을 테이블 요소로 유지 */
        width: 100%; /* tbody 영역 내에서 테이블 크기를 맞춤 */
        table-layout: fixed; /* 고정된 테이블 레이아웃 */
    }
</style>
