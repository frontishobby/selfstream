import type { Video } from "./Models"
import { fromFilename, toFilename } from "$lib/VideoParser";
import { readdir } from 'fs/promises';
import { SEARCH_PATH } from '$env/static/private';
import { getBirthTime } from "$lib/BirthTime.server";
import { downloading } from "$lib/Downloading.server";

export const getVideos = async (tag: string | null) => {
    const data = await readdir(SEARCH_PATH)
    const videos: Video[] = data
        .filter((filename: string) => filename.endsWith('.mp4'))
        .map((d: string) => fromFilename(d))
        .filter((file: Video | null) => file !== null)
        .filter((video: Video) => !Object.keys(downloading).includes(toFilename(video)))
        .filter((video: Video) => tag === null || video.tags.includes(tag))
    
    videos.sort((a, b) => getBirthTime(b) - getBirthTime(a))

    return videos
}