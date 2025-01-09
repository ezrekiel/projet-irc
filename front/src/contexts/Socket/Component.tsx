import { PropsWithChildren, useEffect, useReducer, useState } from "react";
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from "./Context";
import { useSocket } from "../../hooks/useSocket";

export interface ISocketComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketComponentProps> = (props) => {
    const { children } = props;

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    const socket = useSocket('ws://localhost:1337', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false
    })

    useEffect(() => {
        /** Connect to the Web Socket */
        socket.connect();

        /** Save the socket in context */
        SocketDispatch( { type: 'update_socket', payload: socket } );

        /** Strat the event listeners */
        StartListeners();
            /** Reconnect event */
            socket.io.on('reconnect', (attempt) => {
                console.info('Reconnected on attempt: ' + attempt);
            });

            /** Reconnect attempt event */
            socket.io.on('reconnect_attempt', (attempt) => {
                console.info('Reconnection attempt: ' + attempt);
            });

            /** Reconnection error */
            socket.io.on('reconnect_error', (error) => {
                console.info('Reconnection error: ', error);
            });

            /** Reconnection failed */
            socket.io.on('reconnect_failed', () => {
                console.info('Reconnection failure');
                alert('We are unable to connect you to the web socket. ')
            });

        /** Send the handshake */
        SendHandshake();

        // eslint-disable-next-line
    }, [])

    const StartListeners = () => {};
    const SendHandshake = () => {};

    if (loading) return <p>Loading socket IO ....</p>

    return <SocketContextProvider value = {{ SocketState, SocketDispatch }}>
        {children}
    </SocketContextProvider>
};

export default SocketContextComponent;