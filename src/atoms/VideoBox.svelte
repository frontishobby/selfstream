<script lang="ts">
    import type { Video } from "$lib/Models";
    import { toFilename } from "$lib/VideoParser";

    export let video: Video
    const filename = toFilename(video)
    const onclick = async () => {
        window.open(`/view/${filename}`, '_blank')
        return
    }

    const thumbnailSrc = `/thumbnail/${filename}`
</script>

<button class="flex flex-col gap-y-2 py-4 px-1 rounded-lg hover:bg-slate-100" {onclick}>
    <img class="w-[390px] h-[220px]" src={thumbnailSrc} alt="thumbnail" />
    <div class="text-2xl text-truncate w-[390px]">
        {video.name}
    </div>
    {#if video.tags}
        <div class="flex gap-x-2 flex-row">
            {#each video.tags as tag}
                <div>{tag}</div>
            {/each}
        </div>
    {/if}
</button>
