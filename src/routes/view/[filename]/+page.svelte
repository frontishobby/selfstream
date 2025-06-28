<script lang="ts">
    import VideoViewBox from "../../../atoms/VideoViewBox.svelte";
    import Tags from "../../../components/Tags.svelte";
    import ThumbnailBox from "../../../atoms/ThumbnailBox.svelte";
    import {fetchDelete, fetchGet} from "$lib/Fetcher";
    import EditTagModal from "../../../atoms/EditTagModal.svelte"
    import { fromFilename } from "$lib/VideoParser";
    import type { Video } from "$lib/Models";
    import VideoBox from "../../../atoms/VideoBox.svelte"

    const { data } = $props()
    const filename = data.filename
    const videos = data.videos
    const video = fromFilename(filename) as Video
    const thumbnailSrc = `/thumbnail/${filename}`

    const deleteVideo = async () => {
        await fetchDelete(`/video/${filename}`)
        location.href = '/'
    }

    const stringToSeed = (seedString) => {
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
        }
        return seed;
    }

    const mulberry32 = (seed) => {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    }

    const shuffleArray = (array, seedString) => {
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
        }

        const rng = mulberry32(seed);
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1)); // 0 <= j <= i
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    const getTagFilteredVideos = () => {
        const categorizedVideos = {}
            video.tags.forEach(tag => {
                const filteredVideos = videos.filter(tVideo =>
                tVideo.tags.includes(tag) && tVideo.name !== video.name
            );
            categorizedVideos[tag] = shuffleArray(filteredVideos, stringToSeed(video.name));
        })
        
        return categorizedVideos
    }
</script>

<svelte:head>
    <title>{video.name} | Selfstream</title>
</svelte:head>

<div class="w-screen">
    <VideoViewBox {filename}></VideoViewBox>
    <div class="flex flex-col pt-2">
        <div class="px-2 flex justify-between">
            <div class="text-4xl">{video.name}</div>
             <div class="flex gap-x-2">
                <EditTagModal {filename} />
                <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#editTagModal">Edit tag</button>
                <button class="btn btn-danger" onclick={deleteVideo}>Delete</button>
            </div>
        </div>
        <Tags tags={video.tags} />
        {#await fetchGet(`/video/${filename}/detail`) then detail}
            <span class="px-2 text-md font-bold">{(detail.size / 1024 ** 3).toFixed(2)} GB / {new Date(detail.birthTime).toLocaleString()}</span>
        {/await}
    </div>
    <div class="w-full px-5 flex justify-center">
        <ThumbnailBox filename={filename} thumbnailUrl={thumbnailSrc} />
    </div>
    {#each Object.entries(getTagFilteredVideos()) as [tag, videoList]}
        {#if videoList.length > 0}
            <div class="mb-8 no-scrollbar">
                <h2 class="text-2xl font-bold mb-4">Videos tagged with "{tag}"</h2>
                <div class="w-screen overflow-x-auto flex space-x-4 pb-4">
                    {#each videoList as video}
                        <VideoBox {video} />
                    {/each}
                </div>
            </div>
        {/if}
    {/each}
</div>