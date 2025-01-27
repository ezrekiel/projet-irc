import { useState } from "react";
import Input from "./Input";
import "./../index.css";

const Board: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleNewMessage = (messages: string) => {
    setMessages((prevMessages) => [...prevMessages, messages]);
  };

  return (
    <>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <div className="input">
        <Input onSubmit={handleNewMessage} />
      </div>
    </>
  );
};

export default Board;
