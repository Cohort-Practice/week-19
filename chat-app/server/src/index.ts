import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", (socket: WebSocket) => {
  allSockets.push(socket);

  userCount = userCount + 1;
  console.log("user connected #" + userCount);

  socket.on("message", (message) => {
    console.log("message received " + message.toString());
    for (let i = 0; i < allSockets.length; i++) allSockets.forEach(s =>{
        s.send(message.toString() + ": received by server") ;
    })
  });
});
