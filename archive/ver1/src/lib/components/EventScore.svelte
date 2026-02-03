<div class="wrapper">
    <h3>이벤트 스코어</h3>

    <div class="range score1">
        <p>130 ~ 160</p>
        <h3>0</h3>
        <button>click</button>
    </div>
    <div class="range score2">
        <p>160 ~ 190</p>
        <h3>0</h3>
        <button>click</button>
    </div>
    <div class="range score3">
        <p>190 ~ 220</p>
        <h3>0</h3>
        <button>click</button>
    </div>

    <table>
        <thead>
            <tr>
                <th>이월금액</th>
                <th>당일금액</th>
                <th>총금액</th>
                <th>당첨금액</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>20000</td>
                <td>30000</td>
                <td>50000</td>
                <td>17000</td>
            </tr>
        </tbody>
    </table>
</div>

<style lang="scss">
    .wrapper {
        margin: 0 1rem;
        padding: 1rem;
        width: 25%;
        height: 100%;
        border: 1px solid black;
        border-radius: 0.5rem;

        & > .score1 {
            background-color: skyblue;
        }
        & > .score2 {
            background-color: pink;
        }
        & > .score3 {
            background-color: greenyellow;
        }

        & > .range {
            display: flex;
            flex-direction: column;
            position: relative;
            width: 100%;
            border: 1px solid black;
            padding: 0.5rem;
            margin: 0.5rem 0;

            & > button {
                height: 100%;
                width: 4rem;
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }

        & > table {
            width: 100%;
            text-align: center;
        }
    }
</style>
