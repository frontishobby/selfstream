import { SEARCH_PATH } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { stat } from 'fs/promises'
import { resolve } from 'path'

export async function GET({ params }) {
    const videoPath = resolve(`${SEARCH_PATH}/${params.filename}`)
    const videoStats = await stat(videoPath)

    return json({ size: videoStats.size, birthTime: videoStats.birthtimeMs })
}