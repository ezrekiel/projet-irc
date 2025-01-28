import { useContext } from "react";
import SocketContext from "../contexts/Socket/Context";

export interface IApplicationProps {}

const Info: React.FunctionComponent<IApplicationProps> = () => {
    const { socket, uid, users } = useContext(SocketContext).SocketState;
  
    return (
      <>
        
        <p>
        <h2>Socket IO Information</h2>
          Your user ID: <strong>{uid}</strong>
          <br />
          Users online: <strong>{users.length}</strong>
          <br />
          Socket ID: <strong>{socket?.id}</strong>
        </p>
      </>
    );
  };

export default Info