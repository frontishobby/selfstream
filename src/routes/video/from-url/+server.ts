import { json } from "@sveltejs/kit"
import { SEARCH_PATH } from '$env/static/private';
import fs from 'fs';
import http from 'http';
import ffmpeg from "fluent-ffmpeg";

const downloading: Record<string, number> = {}

export async function POST({ request }) {
    let { url, filename }= await request.json()
    downloading[filename] = 0
    if (url.includes('surrit.com')) {
        downloadFromMissav(url, filename)
        return json({success: true})
    }

    url = url.replace('https', 'http')
    const filepath = `${SEARCH_PATH}/${filename}`
    await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);

        http.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close()
                delete downloading[filename]
                resolve(null)
            })
        }).on('error', (err) => {
            delete downloading[filename]
            fs.unlink(filepath, () => {
                reject(err)
            })
        })
    })
}

const downloadFromMissav = (url: string, filename: string) => {
    console.log('download start.')
    return new Promise(res => {
        const filepath = `${SEARCH_PATH}/${filename}`
        let duration: number;
        ffmpeg(url)
            .outputOptions('-c copy')
            .addInputOptions(`-headers origin:https://missav.com`)
            .save(filepath)
            .on('end', () => {
                console.log('end...')
                res(filename)
            })
            .on('error', (err) => {
                console.log(err)
                console.log(`${filename} download failed`)
                fs.unlinkSync(filepath)
            })
            .on('progress', progress => {
                const progressedDuration = convertToSeconds(progress.timemark)
                downloading[filename] = (progressedDuration / duration) * 100
            })
            .ffprobe((err, metadata) => {
                duration = metadata.format.duration as number
            })
    })
}

const convertToSeconds = (timeString: string): number => {
    // 정규 표현식을 사용하여 시, 분, 초를 추출
    const regex = /(\d+):(\d+):(\d+)(?:\.(\d+))?/;
    const matches = timeString.match(regex);

    if (!matches) {
        throw new Error('Invalid time format');
    }

    const hours = parseInt(matches[1], 10) || 0; // 시
    const minutes = parseInt(matches[2], 10) || 0; // 분
    const seconds = parseInt(matches[3], 10) || 0; // 초

    return hours * 3600 + minutes * 60 + seconds
}