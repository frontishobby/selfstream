import { env } from '$env/dynamic/private';
import { statSync } from 'fs';
import { toFilename } from './VideoParser';
import type { Video } from './Models';

const videoBirthTime: Record<string, Date> = {}

export const getBirthTime = (video: Video): number => {
    const filename = toFilename(video)
    if (!videoBirthTime[filename]) {
        videoBirthTime[filename] = statSync(env.SEARCH_PATH + '/' + filename).birthtime
    }

    return videoBirthTime[filename].getTime()
}
