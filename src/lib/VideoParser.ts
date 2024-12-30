import type { Video } from "./Models"

export const toFilename = (video: Video): string => {
    return video.tags.join('-') + '-' + video.name + '.mp4'
}

export const fromFilename = (filename: string): Video | null => {
    const sp = filename.split('-')
    if (sp.length < 2) {
        return null
    }

    const sp2 = sp.pop()?.split('.') as string[]
    if (sp2?.length < 2) {
        return null
    }

    return <Video>{
        name: sp2[0],
        tags: sp
    }
}
