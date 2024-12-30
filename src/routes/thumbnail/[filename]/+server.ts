import { SEARCH_PATH } from '$env/static/private';
import { fromFilename } from '$lib/VideoParser';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export async function GET({ params }) {
    const imagePath = resolve(`${SEARCH_PATH}/${params.filename.replace('.mp4', '')}-thumbnail.webp`);
    try {
        const image = await readFile(imagePath);

        return new Response(image, {
        status: 200,
        headers: {
            'Content-Type': 'image/webp',
        },
        });
    } catch (error) {
        return new Response('Image not found', { status: 404 });
    }
}
