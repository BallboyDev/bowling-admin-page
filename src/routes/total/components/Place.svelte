<script>
    // @ts-nocheck
    import {
        Button,
        Carousel,
        CarouselControl,
        CarouselIndicators,
        CarouselItem,
    } from "@sveltestrap/sveltestrap";
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import { blur, fade, slide } from "svelte/transition";

    // props, state value
    const items = [
        "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa1d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa1d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22218.3%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
        // "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa20%20text%20%7B%20fill%3A%23444%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa20%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23666%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22247.3203125%22%20y%3D%22218.3%22%3ESecond%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
        // "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15ba800aa21%20text%20%7B%20fill%3A%23333%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15ba800aa21%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23555%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22277%22%20y%3D%22218.3%22%3EThird%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
    ];
    let activeIndex = $state(0);

    onMount(() => {
        handle.chart();
    });

    // $effect(() => {
    //     if (!!visible) {
    //         handle.chart();
    //     }
    // });

    const handle = {
        chart: () => {
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
        },
    };
    const callApi = {};
</script>

<div id="places" class="p-2 mb-3 rounded-4">
    <div class="small fw-bold">광교진락볼링장</div>
    <div class="chart d-flex justify-content-center">
        <Carousel {items} bind:activeIndex>
            <CarouselIndicators bind:activeIndex {items} />
            <div class="carousel-inner">
                {#each items as item, index}
                    <CarouselItem
                        class="d-flex justify-content-center"
                        bind:activeIndex
                        itemIndex={index}
                    >
                        <!-- <img
                            src={item}
                            class="d-block w-100"
                            alt="{item} {index + 1}"
                        /> -->
                        <canvas id="placeChart" class="w-75 h-75"></canvas>
                    </CarouselItem>
                {/each}
            </div>

            <CarouselControl direction="prev" bind:activeIndex {items} />
            <CarouselControl direction="next" bind:activeIndex {items} />
        </Carousel>
    </div>
</div>

<style lang="scss">
    #places {
        background-color: #282828;
        border: 1px solid gray;

        & > .chart {
            & > .wrapper {
                width: 10rem;
                height: 10rem;
                border: 1px solid white;

                & > div {
                    background-color: gray;
                }
            }
        }
    }
</style>
