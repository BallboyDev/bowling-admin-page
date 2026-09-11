<script lang="ts">
    import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "@sveltestrap/sveltestrap";
    let { isOpen = $bindable(false), winnerName, round, canDraw, onDraw }: {
        isOpen?: boolean; winnerName: string | null; round: number;
        canDraw: boolean; onDraw: () => void;
    } = $props();
    const uid = $props.id();
    const colors = ["var(--bs-primary)", "var(--bs-warning)", "var(--bs-info)", "var(--bs-success)", "var(--bs-danger)"];
    const close = () => { isOpen = false; };
</script>

<Modal {isOpen} toggle={close} centered labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        정기전 행운의 주인공
        <button slot="close" type="button" class="btn-close" aria-label="추첨 결과 닫기" onclick={close}></button>
    </ModalHeader>
    <ModalBody class="position-relative overflow-hidden text-center p-4">
        {#key round}
            <div class="position-absolute top-0 start-0 w-100 h-100 pe-none" aria-hidden="true">
                {#each Array.from({ length: 36 }) as _, index}
                    <span class="confetti position-absolute" style={`left: ${(index * 37) % 100}%; background: ${colors[index % colors.length]}; animation-delay: ${(index % 8) * 0.08}s; transform: rotate(${index * 29}deg);`}></span>
                {/each}
            </div>
            <div class="position-relative">
                <img src="/gbc.png" alt="개빡세 볼링클럽" class="img-fluid mb-3" style="max-width: 8rem;" />
                <p class="text-body-secondary mb-2">축하합니다!</p>
                <p class="display-5 fw-bold text-primary text-break mb-3" role="status" aria-live="polite">{winnerName || "당첨자 없음"}</p>
                <p class="small text-body-secondary mb-0">다시 뽑으면 모든 참가자가 추첨 대상에 포함됩니다.</p>
            </div>
        {/key}
    </ModalBody>
    <ModalFooter>
        <Button color="primary" outline disabled={!canDraw} onclick={onDraw}>다시 뽑기</Button>
        <Button color="primary" onclick={close}>확인</Button>
    </ModalFooter>
</Modal>

<style>
    .confetti {
        top: -1rem;
        width: 0.5rem;
        height: 0.75rem;
        opacity: 0;
        animation: fall 2s ease-in forwards;
    }
    @keyframes fall {
        0% { opacity: 1; }
        100% { top: 110%; transform: translateX(2rem) rotate(540deg); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
        .confetti { animation: none; }
    }
</style>
