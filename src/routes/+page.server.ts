import type { Video } from "$lib/Models"
import type { Load } from "@sveltejs/kit"
import { SEARCH_PATH } from '$env/static/private';
import checkDiskSpace from "check-disk-space";
import { getVideos } from "$lib/Video.server";

export const load: Load = async ({ url }) => {
    const searchParams = url.searchParams

    const tag = searchParams.get('tag')
    const videos: Video[] = await getVideos(tag)
    const diskInfo = await checkDiskSpace(SEARCH_PATH)

    return { videos, diskInfo }
}
