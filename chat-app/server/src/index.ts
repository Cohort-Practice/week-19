import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  username: string;
  roomId: string;
}

interface ChatMessage {
  username: string;
  message: string;
}

let users: User[] = [];
let roomMessages: Record<string, ChatMessage[]> = {};

wss.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());


      if (data.type === "join") {
        const { username, roomId } = data.payload;
        if (!username || !roomId) return;

        users.push({ socket, username, roomId });

        // Initialize room history if not exists
        if (!roomMessages[roomId]) {
          roomMessages[roomId] = [];
        }

        socket.send(
          JSON.stringify({
            type: "history",
            payload: roomMessages[roomId],
          })
        );

        console.log(`${username} joined room ${roomId}`);
        return;
      }

      if (data.type === "chat") {
        const currentUser = users.find((u) => u.socket === socket);
        if (!currentUser) return;

        const chatMessage = {
          username: currentUser.username,
          message: data.payload.message,
        };

       
        roomMessages[currentUser.roomId].push(chatMessage);

        users
          .filter((u) => u.roomId === currentUser.roomId)
          .forEach((u) =>
            u.socket.send(
              JSON.stringify({
                type: "chat",
                payload: chatMessage,
              })
            )
          );
      }
    } catch (err) {
      console.error("Invalid message", err);
    }
  });

  socket.on("close", () => {
    users = users.filter((u) => u.socket !== socket);
    console.log("Client disconnected");
  });
});

console.log(" the server is running ");
