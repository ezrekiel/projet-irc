import { useState } from "react";
import Input from "./Input";

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
        <Input onSubmit={handleNewMessage} />
        </>
    )
}

export default Board;