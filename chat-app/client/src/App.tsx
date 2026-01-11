import React, { useEffect, useState } from "react";

interface ChatMessage {
  username: string;
  message: string;
}

const App: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setMessages((prev) => [
          ...prev,
          {
            username: data.payload.username,
            message: data.payload.message,
          },
        ]);
      }
    };

    setWs(socket);

    return () => socket.close();
  }, []);

  const joinRoom = () => {
    if (!ws || !username || !roomId) return;

    ws.send(
      JSON.stringify({
        type: "join",
        payload: {
          username,
          roomId,
        },
      })
    );

    setJoined(true);
  };

  const sendMessage = () => {
    if (!ws || !input.trim()) return;

    ws.send(
      JSON.stringify({
        type: "chat",
        payload: {
          message: input,
        },
      })
    );

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {!joined ? (
        <>
        <div className="flex flex-col gap-5 items-center justify-center">
          <p className="text-xl mb-3"> chat app</p>
          <input
          className="h-10 w-70 border-gray-400 border-1 p-5 rounded-md"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="h-10 w-70 border-gray-400  border-1 p-5 rounded-md"
            placeholder="Room name"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button 
          className="bg-blue-400 h-10 w-50 rounded-md text-white hover:bg-blue-700"
          onClick={joinRoom}>
            Join Room
          </button>
          </div>
        </>
      ) : (
        <>
        <div>
          <div>
            {messages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.username}:</strong> {msg.message}
              </div>
            ))}
          </div>

          <input
          className="h-10 w-70 border-gray-400 border-1 p-4 rounded-md mr-3"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
                    className="bg-blue-400 h-10 w-26 rounded-md text-white hover:bg-blue-700"
          onClick={sendMessage}>
            Send
          </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
