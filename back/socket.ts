import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    // liste de tous les utilisateurs connectés
    public users: { [uid: string]: string };

    constructor (server: HTTPServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.StartListeners);

        console.info('Socket IO started');
    }

    StartListeners = (socket: Socket) => {
        console.info('Message received from ' + socket.id);

        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            console.info('Handshake received from ' + socket.id);

            // check en cas reconnexion
            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info('This user has reconnected.');
                const uid = this.GetUidFromSocketId(socket.id);
                const users = Object.values(this.users);

                if (uid) {
                    console.info('Sending callback for reconnect...');
                    callback(uid, users);
                    return;
                }
            }

            // generer un nouveau user
            const uid = v4();
            this.users[uid] = socket.id;
            const users = Object.values(this.users);

            console.info('Sending callback for handshake...');
            callback(uid, users);
            
            // envoi du nouveau user aux autres connectés
        });

        socket.on('disconnect', () => {
            console.info('Disconnect received from ' + socket.id);
        })
    }
}