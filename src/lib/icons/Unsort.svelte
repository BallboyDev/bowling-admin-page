<script lang="ts">
    let { width = "14", height = "14", asc = false, desc = false } = $props();
</script>

<div class="mx-1">
    <svg
        {width}
        {height}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 400 400"
    >
        <g>
            <title>Layer 1</title>
            <path
                stroke="#f8f9fa"
                stroke-width="30"
                fill={asc ? "#f8f9fa" : "none"}
                d="m38.00002,163.53387l161.99999,-153.53387l161.99999,153.53387l-324,0l0.00002,0z"
                id="svg_2"
            />
            <path
                transform="rotate(180 200 313.233)"
                stroke="#f8f9fa"
                stroke-width="30"
                fill={desc ? "#f8f9fa" : "none"}
                d="m38.00002,390l161.99999,-153.53387l161.99999,153.53387l-324,0l0.00002,0z"
                id="svg_4"
            />
        </g>
    </svg>
</div>
