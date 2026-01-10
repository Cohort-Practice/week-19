import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [ socket , setSocket] = useState();
  function sendMessage() {
    if(!socket) {
      return ;
    }
   
    socket.send("ping")
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (ev) => {
      alert(ev.data);
    };
  }, []);

  return (
    <>
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <div className="flex space-x-2 flex-row">
          <input className="w-70 h-8 rounded-md bg-gray-100 border border-gray-400" type="text" placeholder="Message ..." />
        <button className="w-20 h-8 rounded-md bg-blue-500 text-white " onClick={sendMessage}>send</button>
        </div>
      </div>
    </>
  );
}

export default App;
