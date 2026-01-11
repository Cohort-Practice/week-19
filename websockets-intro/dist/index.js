import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (socket) => {
    console.log('user connected');
    setInterval(() => {
        socket.send("Current price of solana is " + Math.random());
    }, 2000);
    socket.on("message", (e) => {
        console.log(e.toString());
    });
});
//# sourceMappingURL=index.js.map