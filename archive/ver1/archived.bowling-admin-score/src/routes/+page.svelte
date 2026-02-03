<script>
    import { browser } from "$app/environment";
    import { PUBLIC_API_URL } from "$env/static/public";
    import { getStorage, setStorage } from "$lib/localStorage.svelte";
    import axios from "axios";
    import { onMount } from "svelte";

    let name = $state("");
    let memberNum = $state("");

    onMount(() => {
        // if (browser) {
        //     const userInfo = localStorage.getItem("userInfo");

        //     if (!!userInfo) {
        //         location.href = "/score";
        //     }
        // }

        const userInfo = getStorage("userInfo");
        if (!!userInfo) {
            location.href = "/score";
        }
    });

    const handle = {
        onLogin: () => {
            if (name === "" || memberNum === "") {
                alert("로그인 정보를 입력해주세요");
                return;
            }
            callApi.login();
        },
        onJoin: async () => {
            if (name === "" || memberNum === "") {
                alert("회원가입 정보를 입력해주세요");
                return;
            }

            await callApi.join();
        },
    };

    const callApi = {
        login: async () => {
            await axios
                .get(
                    `${PUBLIC_API_URL}/bap/login?name=${name}&num=${memberNum}`,
                )
                .then((res) => {
                    const userInfo = res.data;

                    if (userInfo.length > 0 /* && browser */) {
                        // localStorage.setItem(
                        //     "userInfo",
                        //     `${userInfo[0].name}/${userInfo[0].memberNum}`,
                        // );
                        setStorage(
                            "userInfo",
                            `${userInfo[0].name}/${userInfo[0].memberNum}`,
                        );
                        location.href = "/score";
                    } else if (userInfo.length === 0) {
                        alert("로그인 정보를 확인해주세요");
                    }
                });
        },
        join: async () => {
            await axios
                .post(`${PUBLIC_API_URL}/bap/join`, {
                    name,
                    num: memberNum,
                })
                .then((res) => {
                    if (res.data.state === "duplicate") {
                        alert("중복된 계정이 있습니다.");
                    }
                });
        },
    };
</script>

<div id="landingPage">
    <div class="loginBox">
        <input type="text" placeholder="이름" bind:value={name} />
        <input type="text" placeholder="회원 번호" bind:value={memberNum} />
        <div class="btnBox">
            <button class="join" onclick={handle.onJoin}>회원가입</button>
            <button class="login" onclick={handle.onLogin}>로그인</button>
        </div>
    </div>
</div>

<style lang="scss">
    #landingPage {
        position: absolute;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        & > .loginBox {
            width: 15rem;

            padding: 1rem;
            border: 1px solid gray;
            border-radius: 1rem;

            background-color: #222222;
            display: flex;
            flex-direction: column;
            & > input {
                height: 2rem;
                margin-bottom: 1rem;
                font-size: 1rem;
                text-align: center;
                border-radius: 0.5rem;
            }

            & > .btnBox {
                height: 2rem;
                display: flex;

                & > button {
                    width: 50%;
                    border: 1px solid gray;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #cccccc;
                }

                & > .join {
                    margin-right: 0.5rem;
                    background-color: rgba(0, 0, 255, 0.3);
                }
                & > .login {
                    background-color: rgba(255, 0, 0, 0.3);
                }
            }
        }
    }
</style>
