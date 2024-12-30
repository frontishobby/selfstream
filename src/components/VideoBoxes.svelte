<script lang="ts">
    import VideoBox from "../atoms/VideoBox.svelte";

    export let videos: Video[] = []
</script>

<div class="w-full flex flex-wrap gap-x-4 gap-y-10 justify-center pt-10">
    {#each videos as video}
        <VideoBox {video}></VideoBox>
    {/each}
</div>