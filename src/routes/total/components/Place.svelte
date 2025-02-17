<script>
    // @ts-nocheck
    import { Button } from "@sveltestrap/sveltestrap";
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";

    // props, state value

    onMount(() => {});

    const handle = {};
    const callApi = {};
</script>

<div id="places" class="p-2 mb-3 rounded-4">
    <div class="small fw-bold">광교진락볼링장</div>
    <div class="chart d-flex justify-content-center">
        <canvas id="placeChart" class="w-75 h-75"></canvas>
    </div>
    <!-- <div class="d-flex justify-content-center">* * *</div> -->
    <Button
        children="BUTTON"
        onclick={() => {
            let ctx = document.getElementById("placeChart");
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    datasets: [
                        {
                            data: [180, 120],
                            backgroundColor: [
                                "rgb(54, 162, 235)",
                                "rgb(255, 99, 132, 0)",
                            ],
                        },
                    ],
                },
                options: {
                    plugins: {
                        tooltip: false,
                    },
                },
                plugins: [
                    {
                        beforeDraw: (chart) => {
                            const ctx = chart.ctx;

                            ctx.font = "50px Arial";
                            ctx.fillStyle = "#cccccc";
                            ctx.textAlign = "center";
                            ctx.fillText(
                                "180",
                                ctx.canvas.clientWidth / 2,
                                ctx.canvas.clientHeight / 2 + 8,
                            );
                        },
                    },
                ],
            });
        }}
    />
</div>

<style lang="scss">
    #places {
        background-color: #282828;
        border: 1px solid gray;
    }
</style>
