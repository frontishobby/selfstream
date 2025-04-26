import { SEARCH_PATH } from '$env/static/private';
import { createThumbnail } from '$lib/Thumbnail.server';
import { json } from '@sveltejs/kit';
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

export async function PUT({ params }) {
    const filename = params.filename
    await createThumbnail(filename)
    return json({ success: true })
}

