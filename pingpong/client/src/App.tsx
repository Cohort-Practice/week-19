import React, { useEffect, useState, useRef } from "react";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMessage() {
    if (!socket || socket.readyState !== WebSocket.OPEN || !inputRef.current) {
      return;
    }
    const message = inputRef.current.value;
    socket.send(message);
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (ev) => {
      alert(ev.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex space-x-2 flex-row">
        <input
          ref={inputRef}
          className="w-72 h-8 rounded-md bg-gray-100 border border-gray-400"
          type="text"
          placeholder="Message ..."
        />
        <button
          className="w-20 h-8 rounded-md bg-blue-500 text-white cursor-pointer"
          onClick={sendMessage}
        >
          send
        </button>
      </div>
    </div>
  );
}

export default App;