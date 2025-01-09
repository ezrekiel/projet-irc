const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur');
});

io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
