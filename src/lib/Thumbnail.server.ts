import { SEARCH_PATH } from "$env/static/private";
import ffmpeg from "fluent-ffmpeg";
import { mkdir } from 'fs/promises'

export async function createThumbnail(filename: string) {
    const videoPath = `${SEARCH_PATH}/${filename}`
    if (filename.split('.').pop() !== 'mp4') {
        return
    }

    await new Promise((res, err) => {
        ffmpeg(videoPath)
            .on("end",  () => {
                console.log("Screenshots taken")
                res(null)
            })
            .on("error", (e) => {
                console.error(e)
                err(e)
            })
            .screenshots({
                timestamps: [`${generateRandomString()}%`],
                folder: SEARCH_PATH,
                size: "1170x660",
                filename: "%b-thumbnail.webp",
            });
    })
}

export async function createPreview(filename: string) {
    const videoPath = `${SEARCH_PATH}/${filename}`
    if (filename.split('.').pop() !== 'mp4') {
        return
    }

    const fileNameExceptExt = filename.split('.')[0]
    const previewPath = `${SEARCH_PATH}/preview/${fileNameExceptExt}`
    await mkdir(previewPath)

    await Promise.all(Array.from({ length: 20 }, (_, i) => i).map(index => {
        new Promise((res, err) => {
            ffmpeg(videoPath)
                .on("end",  () => {
                    console.log(`Preview ${index} taken`)
                    res(null)
                })
                .on("error", (e) => {
                    console.error(e)
                    err(e)
                })
                .screenshots({
                    timestamps: [`${5 * index}%`],
                    folder: previewPath,
                    size: "1170x660",
                    filename: `${index}.webp`,
                });
        })
    }))
}

// 0부터 100.0까지의 랜덤한 정수 문자열 생성
function generateRandomString() {
    const randomNumber = Math.floor(Math.random() * 100)
    const randomUnder = Math.floor(Math.random() * 10)
    return `${randomNumber}.${randomUnder}`;
}