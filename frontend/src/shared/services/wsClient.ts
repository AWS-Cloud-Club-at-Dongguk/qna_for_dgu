const WS_BASE_URL = import.meta.env.VITE_API_WS_BASE_URL
const STAGE = import.meta.env.VITE_API_STAGE

type WsClient = {
    connect: (
        path: string,
        params: Record<string, any>,
        onMessage: (event: MessageEvent) => void,
        onError?: (error: Event) => void
    ) => WebSocket

    send: (socket: WebSocket, message: object) => void
    close: (socket: WebSocket) => void
}

const pingIntervalMap = new Map<WebSocket, number>() // WebSocket별 ping interval 저장

const wsClient: WsClient = {
    connect: (
        path: string,
        params: Record<string, any>,
        onMessage: (message: MessageEvent) => void,
        onError?: (error: Event) => void
    ) => {
        const queryString = new URLSearchParams(params).toString()
        const requestUrl =
            `${WS_BASE_URL}/${STAGE}/${path}` +
            (queryString ? `?${queryString}` : '')
        const socket = new WebSocket(requestUrl)

        socket.onopen = () => {
            const intervalId = window.setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'ping' }))
                }
            }, 30000)

            pingIntervalMap.set(socket, intervalId) // 여기에 저장됨
        }

        socket.onclose = () => {
            const intervalId = pingIntervalMap.get(socket)
            if (intervalId) {
                clearInterval(intervalId) // 연결 종료 시 clear
                pingIntervalMap.delete(socket)
            }
        }

        socket.onmessage = onMessage

        if (onError) {
            socket.onerror = onError
        }

        return socket
    },

    send: (socket: WebSocket, message: object) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
        } else {
            console.error('WebSocket is not open. Unable to send message.')
        }
    },

    close: (socket: WebSocket) => {
        if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CLOSING
        ) {
            socket.close()
        } else {
            console.error('WebSocket is already closed or closing.')
        }
    },
}

export default wsClient

// Usage example:
// const socket = wsClient.connect('your-path', (message) => {
//     console.log('Received message:', message.data);
// });
// wsClient.send(socket, JSON.stringify({ type: 'greeting', content: 'Hello!' }));
// wsClient.close(socket);
