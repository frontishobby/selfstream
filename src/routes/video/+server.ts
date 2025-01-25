import { SEARCH_PATH } from '$env/static/private';
import fs from 'fs';
import { fail, json } from '@sveltejs/kit';
import { createPreview, createThumbnail } from '$lib/Thumbnail.server';
import Busboy from 'busboy';
import { pipeline } from 'stream/promises';

export async function POST({ request }) {
    const filename = decodeURIComponent(request.headers.get('filename'))
    const busboy = Busboy({ headers: { ...request.headers, 'content-type': request.headers.get('content-type'), } });
    const filePath = `${SEARCH_PATH}/${filename}`
    busboy.on('file', (name, file, info) => {
		const { filename, encoding, mimeType } = info;
		console.log(
			`File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
			filename,
			encoding,
			mimeType
		);
		file.pipe(fs.createWriteStream(filePath));
	});
	busboy.on('field', (name, val, info) => {
		console.log(`Field [${name}]: value: %j`, val);
	});
	busboy.on('close', () => {
		console.log('Done parsing form!');
	});

	await pipeline(request.body as any, busboy);
    await createThumbnail(filename)
    createPreview(filename)

    return json({ success: true })
}
