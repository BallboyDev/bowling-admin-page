<!-- 
<SelectBtn
    btnList={[
        {
            text: "취소",
            color: "danger",
            onClick: () => {
                console.log("cancel");
            },
        },
        {
            text: "확인",
            color: "primary",
            onClick: () => {
                console.log("confirm");
            },
        },
    ]}
/> 
-->
<script>
    // @ts-nocheck

    import { Button, ButtonGroup } from "@sveltestrap/sveltestrap";

    const { text, btnList } = $props();
</script>

<div
    id="popup-selectBtn"
    class="position-fixed fixed-top d-flex w-100 h-100 justify-content-center align-items-center"
>
    <div class="selectBox p-3 rounded-4 d-flex flex-column">
        <div class="textBox d-flex justify-content-center align-items-center">
            <p>{text || ""}</p>
        </div>
        <div class="d-flex">
            <ButtonGroup class="w-100">
                {#each btnList as btn}
                    <Button
                        outline
                        children={btn.text}
                        color={btn.color}
                        onclick={btn.onClick}
                    />
                {/each}
            </ButtonGroup>
        </div>
    </div>
</div>

<style lang="scss">
    #popup-selectBtn {
        background-color: rgba(0, 0, 0, 0.4);

        & > .selectBox {
            width: 20rem;
            border: 1px solid gray;
            background-color: #222222;

            & > .textBox {
                min-height: 4rem;
            }
        }
    }
</style>
