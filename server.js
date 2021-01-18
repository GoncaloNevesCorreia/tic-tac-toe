import express from 'express';
import http from 'http';
import CreateGame from "./modules/game.js"
import { Server } from 'socket.io';

const port = 3000;

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const untakenSpace = 0;
const playAgainstComputer = false;

const clientSockets = {};
const players = {};

let unmatched = null;


app.use(express.static('Client'));

const addPlayer = socket => {
    clientSockets[socket.id] = socket;

    const game = new CreateGame(socket.id, unmatched, untakenSpace, playAgainstComputer);
    players[socket.id] = game;
    console.log(`> Players :${players}`);
};

const removePlayer = socket => {
    console.log("Client disconnected", socket.id);
    delete players[socket.id];
    delete clientSockets[socket.id];
    if (socket.id === unmatched) unmatched = null;
};


sockets.on('connection', (socket) => {
    const playerID = socket.id;

    console.log(`> Player connected on server with id: ${playerID}`);


    joinGame(socket);

    // Once the socket has an opponent, we can begin the game
    if (getOpponent(socket)) {
        socket.emit("game.begin", {
            state: players[playerID]
        });

        getOpponent(socket).emit("game.begin", {
            state: players[getOpponent(socket).id]
        });
    }

    // Listens for a move to be made and emits an event to both
    // players after the move is completed
    socket.on("make.move", function(data) {
        if (!getOpponent(socket)) return;


        socket.emit("move.made", data);
        getOpponent(socket).emit("move.made", data);
    });

    // Emit an event to the opponent when the player leaves
    socket.on("disconnect", function() {
        if (getOpponent(socket)) {
            getOpponent(socket).emit("opponent.left");
        }
        removePlayer(socket);
    });


    socket.on("mousemove", data => {
        data.id = id;
        socket.broadcast.emit("moving", data);
    });


    console.log(players);
});




function joinGame(socket) {
    addPlayer(socket);

    if (unmatched) {
        players[socket.id].playerSymbol = 'O';
        players[socket.id].opponentSymbol = 'X';
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

// Returns the opponent socket
function getOpponent(socket) {
    if (players[socket.id].opponent) {
        const opponentID = players[socket.id].opponent;
        return clientSockets[opponentID];
    }
    return;
}











server.listen(port, () => {
    console.log(`> Server is listening on port: ${port}`);
});