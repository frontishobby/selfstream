export async function fetchGet(path: string): Promise<Record<string, any>> {
    const resp = await fetch(path)
    if (resp.status === 401) {
        document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.location.href = '/'
        return {}
    }
    return resp.json()
}

export async function fetchPut(path: string, body: any): Promise<Record<string, any>> {
    const resp = await fetch(path, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (resp.status === 401) {
        document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.location.href = '/'
        return {}
    }
    return resp.json()
}

export async function fetchPost(path: string, body: any): Promise<Record<string, any>> {
    const resp = await fetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (resp.status === 401) {
        document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.location.href = '/'
        return {}
    }
    return resp.json()
}

export async function fetchDelete(path: string): Promise<void> {
    const resp = await fetch(path,  { method: 'DELETE' })
    if (resp.status === 401) {
        document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.location.href = '/'
        return
    }
    return
}