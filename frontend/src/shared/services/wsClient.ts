const WS_BASE_URL = import.meta.env.VITE_API_WS_BASE_URL;
const STAGE = import.meta.env.VITE_API_STAGE;


type WsClient = {
  connect: (
    path: string,
    params: Record<string, any>,
    onMessage: (event: MessageEvent) => void,
    onError?: (error: Event) => void
  ) => WebSocket;

  send: (socket: WebSocket, message: object) => void;
  close: (socket: WebSocket) => void;
};

const wsClient: WsClient = {
    connect: (path: string, params: Record<string, any>, onMessage: (message: MessageEvent) => void, onError?: (error: Event) => void) => {
        const queryString = new URLSearchParams(params).toString();
        const requestUrl = `${WS_BASE_URL}/${STAGE}/${path}` + (queryString ? `?${queryString}` : '');
        const socket = new WebSocket(requestUrl);

        socket.onopen = () => {
            console.log(`WebSocket connection established at ${requestUrl}`);
            setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ type: 'ping' }));
                }
            }, 30000); // Send a ping every 30 seconds
        };

        socket.onmessage = onMessage;

        if (onError) {
            socket.onerror = onError;
        }

        return socket;
    },

    send: (socket: WebSocket, message: object) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    },

    close: (socket: WebSocket) => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) {
            socket.close();
        } else {
            console.error('WebSocket is already closed or closing.');
        }
    }
};

export default wsClient;

// Usage example:
// const socket = wsClient.connect('your-path', (message) => {
//     console.log('Received message:', message.data);
// });
// wsClient.send(socket, JSON.stringify({ type: 'greeting', content: 'Hello!' }));
// wsClient.close(socket);