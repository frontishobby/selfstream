<script lang="ts">
    import VideoViewBox from "../../../atoms/VideoViewBox.svelte";
    import Tags from "../../../components/Tags.svelte";
    import ThumbnailBox from "../../../atoms/ThumbnailBox.svelte";
    import {fetchDelete} from "$lib/Fetcher";
    import EditTagModal from "../../../atoms/EditTagModal.svelte"
    import { fromFilename } from "$lib/VideoParser";
    import type { Video } from "$lib/Models";

    const { data } = $props()
    const filename = data.filename
    const video = fromFilename(filename) as Video
    const thumbnailSrc = `/thumbnail/${filename}`

    const deleteVideo = async () => {
        await fetchDelete(`/video/${filename}`)
        location.href = '/'
    }

</script>

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
    </div>
    <div class="w-full px-5 flex justify-center">
        <ThumbnailBox filename={filename} thumbnailUrl={thumbnailSrc} />
    </div>
</div>