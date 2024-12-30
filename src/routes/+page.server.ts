import type { Video } from "$lib/Models"
import type { Load } from "@sveltejs/kit"
import { readdir } from 'fs/promises';
import { SEARCH_PATH } from '$env/static/private';
import { fromFilename, toFilename } from "$lib/VideoParser";
import checkDiskSpace from "check-disk-space";
import { getBirthTime } from "$lib/Birthtime.server";

const downloading = {}

export const load: Load = async ({ url }) => {
    const data = await readdir(SEARCH_PATH)
    const searchParams = url.searchParams

    const tag = searchParams.get('tag')
    const videos: Video[] = data
        .filter((filename: string) => filename.endsWith('.mp4'))
        .map((d: string) => fromFilename(d))
        .filter((file: Video | null) => file !== null)
        .filter((video: Video) => !Object.keys(downloading).includes(toFilename(video)))
        .filter((video: Video) => tag === null || video.tags.includes(tag))
    
    videos.sort((a, b) => getBirthTime(b) - getBirthTime(b))

    const diskInfo = await checkDiskSpace(SEARCH_PATH)

    return { videos, diskInfo }
}
