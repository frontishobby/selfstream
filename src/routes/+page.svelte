<script lang="ts">
    import DiskRemain from "../atoms/DiskRemain.svelte";
    import ProgressBox from "../atoms/ProgressBox.svelte";
    import Tags from "../components/Tags.svelte";
    import VideoBoxes from "../components/VideoBoxes.svelte";
    import type { Video } from "$lib/Models";
    import { page } from '$app/stores';

    const { data } = $props()
    const videos = data.videos
    const tags = Array.from(new Set(videos.flatMap(v => v.tags)))
    let diskRemainText = $state('')
    const isTagSearch = $page.url.searchParams.has('tag')
</script>
<svelte:head>
    <title>SelfStream</title>
</svelte:head>

<div class="h-screen w-screen">
    <div class="flex flex-wrap justify-center w-full m-2">
        <ProgressBox title="Disk Space" description={diskRemainText}>
            <DiskRemain diskInfo={data.diskInfo} bind:diskRemainText />
        </ProgressBox>
    </div>
    {#if tags && !isTagSearch}
        <Tags {tags} />
    {/if}
    <VideoBoxes {videos}></VideoBoxes>
</div>