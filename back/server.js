// imports modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// appels modules
const app = express();
const server = http.createServer(app);

const bodyParser = require('body-parser');
const cors = require('cors');

const io = new Server(server);

// definition des routes
// const resourceRouter = require('./routes/resource'); --- route exemple
const authRouter = require('./routes/auth');
const channelRouter = require('./routes/channel');
const messageRouter = require('./routes/message');
const userRouter = require('./routes/user');

app.use((req, res, next) => {
	bodyParser.json()(req, res, err => {
		if (err) return res.status(400).send({ message: 'Error : Bad JSON formatting.' });

		next();
	});
});

app.use(cors());
app.use(express.json());

// Routes
// app.use('/resource', resourceRouter); --- route exemple
app.use('/auth', authRouter);
app.use('/channel', channelRouter);
app.use('/message', messageRouter);
app.use('/user', userRouter);

server = new ServerSocket(httpServer);

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