<script>
    // @ts-nocheck

    import { Button, ButtonGroup } from "@sveltestrap/sveltestrap";
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";

    // props, state value

    onMount(() => {
        let ctx = document.getElementById(`periodChart`);
        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "",
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
                    },
                },
                plugins: {
                    tooltip: false,
                    legend: {
                        display: false,
                    },
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
    <canvas id={`periodChart`}></canvas>
</div>

<style lang="scss">
    #period {
        background-color: #282828;
        border: 1px solid gray;
        min-height: 10rem;
    }
</style>
