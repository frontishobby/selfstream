import { getVideos } from "$lib/Video.server";

export async function load({ params }) {
    const filename = params.filename
    const videos = await getVideos(null)
    return {
      filename, videos
    };
}
