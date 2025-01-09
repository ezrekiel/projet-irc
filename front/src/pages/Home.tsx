import { useContext } from "react";
import SocketContext from "../contexts/Socket/Context";

export interface IApplicationProps {}

const Home: React.FunctionComponent<IApplicationProps> = (props) => {
  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{uid}</strong>
        <br />
        Users online: <strong>{users.length}</strong>
        <br />
        Socket ID: <strong>{socket?.id}</strong>
      </p>
    </div>
  );
};

export default Home;