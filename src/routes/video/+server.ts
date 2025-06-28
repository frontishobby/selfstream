import { SEARCH_PATH } from '$env/static/private';
import fs from 'fs';
import { fail, json } from '@sveltejs/kit';
import { createThumbnail } from '$lib/Thumbnail.server';
import Busboy from 'busboy';
import { pipeline } from 'stream/promises';

export async function POST({ request }) {
    const filename = decodeURIComponent(request.headers.get('filename'));
    const filePath = `${SEARCH_PATH}/${filename}`;

    console.log(filename, filePath)

    // Busboy 인스턴스 생성
    const busboy = Busboy({
        headers: {
            ...request.headers,
            'content-type': request.headers.get('content-type'),
        }
    });

    let fileWriteStream;
    let uploadPromiseResolve;
    let uploadPromiseReject;
    const uploadPromise = new Promise((resolve, reject) => {
        uploadPromiseResolve = resolve;
        uploadPromiseReject = reject;
    });

    busboy.on('file', (name, file, info) => {
        const { filename: originalFilename, encoding, mimeType } = info;
        console.log(
            `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
            originalFilename,
            encoding,
            mimeType
        );

        // 스트림을 이용해 파일 저장
        fileWriteStream = fs.createWriteStream(filePath);

        // 파이프라인으로 스트림 연결 및 에러 처리
        // 'data', 'end', 'error' 이벤트를 수동으로 처리하는 대신 pipeline 사용
        pipeline(file, fileWriteStream)
            .then(() => {
                console.log(`File saved to ${filePath}`);
                // 파일 업로드 성공 시 resolve
                if (uploadPromiseResolve) uploadPromiseResolve();
            })
            .catch(err => {
                console.error(`Error saving file ${filePath}:`, err);
                // 파일 업로드 실패 시 reject
                if (uploadPromiseReject) uploadPromiseReject(err);
            });
    });

    busboy.on('field', (name, val, info) => {
        console.log(`Field [${name}]: value: %j`, val);
    });

    busboy.on('error', (err) => {
        console.error('Busboy error:', err);
        if (uploadPromiseReject) uploadPromiseReject(err); // Busboy 자체 에러 처리
    });

    // Busboy가 모든 폼 데이터를 파싱 완료했을 때
    busboy.on('close', () => {
        console.log('Done parsing form!');
        // 파일 처리가 완료되지 않았을 경우 (예: 파일이 없었을 경우) resolve
        // 이미 file 이벤트에서 resolve/reject 되었을 수도 있음
        if (!fileWriteStream && uploadPromiseResolve) uploadPromiseResolve();
    });

    try {
        // SvelteKit의 request.body를 busboy에 파이프합니다.
        // Node.js v15.x 이상에서는 request.body가 ReadableStream 타입입니다.
        // 이 부분에서 request.body를 busboy에 직접 연결해야 합니다.
        // request.body는 이미 ReadableStream이므로, `.pipe(busboy)`를 사용해야 합니다.
        await pipeline(request.body, busboy);

        // 파일 업로드 완료 대기
        await uploadPromise;

        // 썸네일 및 미리보기 생성은 파일 업로드가 완료된 후에 수행
        await createThumbnail(filename);

        return json({ success: true });
    } catch (error) {
        console.error('File upload or processing failed:', error);
        return fail(500, { message: '파일 업로드 또는 처리 중 오류가 발생했습니다.', error: error.message });
    }
}