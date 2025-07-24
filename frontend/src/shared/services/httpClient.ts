const HTTP_BASE_URL = import.meta.env.VITE_API_HTTP_BASE_URL
const VERSION = import.meta.env.VITE_API_VERSION
const STAGE = import.meta.env.VITE_API_STAGE

type HttpClient = {
    get: <T = any>(path: string, params?: Record<string, any>) => Promise<T>
    post: (path: string, body: Record<string, any>) => Promise<any>
    put: (path: string, body: Record<string, any>) => Promise<any>
    delete: (path: string) => Promise<any>
}

const httpClient: HttpClient = {
    get: async <T = any>(
        path: string,
        params?: Record<string, any>
    ): Promise<T> => {
        const queryString = new URLSearchParams(params).toString()
        const requestUrl = `${HTTP_BASE_URL}/${VERSION}/${STAGE}/${path}${
            queryString ? `?${queryString}` : ''
        }`

        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },

    post: async (path: string, body: Record<string, any>) => {
        const response = await fetch(
            `${HTTP_BASE_URL}/${VERSION}/${STAGE}/${path}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },

    put: async (path: string, body: Record<string, any>) => {
        const response = await fetch(
            `${HTTP_BASE_URL}/${VERSION}/${STAGE}/${path}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },

    delete: async (path: string) => {
        const response = await fetch(
            `${HTTP_BASE_URL}/${VERSION}/${STAGE}/${path}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },
}

export default httpClient

// Usage example:
// httpClient.get('/api/rooms').then(data => console.log(data)).catch(error => console.error(error));
// httpClient.post('/api/rooms', { title: 'New Room' }).then(data => console.log(data)).catch(error => console.error(error));
