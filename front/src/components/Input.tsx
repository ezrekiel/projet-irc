import { useState } from "react";

interface InputProps {
  onSubmit: (message: string) => void;
}

const Input: React.FC<InputProps> = ({ onSubmit }) => {
  const [message, setMessage] = useState<string>("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message here"
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default Input;