<script>
    // @ts-nocheck

    import { Button, ButtonGroup } from "@sveltestrap/sveltestrap";
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";

    // props, state value
    let ctx;
    let chartCanvas = $state(null);

    Chart.register(...registerables);

    onMount(() => {
        ctx = document.getElementById("myChart");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: false,
                },
            },
        });
    });

    const handle = {};
    const callApi = {};
</script>

<div id="period" class="p-2 mb-3 rounded-4">
    <ButtonGroup class="w-100">
        <Button active color="primary" size="sm" children="일" />
        <Button color="primary" size="sm" children="주" />
        <Button color="primary" size="sm" children="월" />
        <Button color="primary" size="sm" children="년" />
    </ButtonGroup>
    <canvas bind:this={chartCanvas} id="myChart"></canvas>
</div>

<style lang="scss">
    #period {
        background-color: #282828;
        border: 1px solid gray;
        min-height: 10rem;
    }
</style>
