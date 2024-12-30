import { SEARCH_PATH } from '$env/static/private';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs'
import { resolve } from 'path';

export async function GET({ params, url, request }) {
    const videoPath = resolve(`${SEARCH_PATH}/${params.filename}`)
    const videoStats = await stat(videoPath);
    const fileSize = videoStats.size;

    const range = request.headers.get('range');

    if (!range) {
        return new Response('Requires Range header', { status: 416 });
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
        return new Response('Requested range not satisfiable', { status: 416 });
    }

    const chunkSize = end - start + 1;
    const fileStream = createReadStream(videoPath, { start, end });

    return new Response(fileStream, {
        status: 206, // Partial Content
        headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': 'video/mp4',
        },
    });
}
