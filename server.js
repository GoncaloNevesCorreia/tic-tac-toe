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

    console.log(`> Client Connected: ${socket.id}`);
};

const removePlayer = socket => {
    delete players[socket.id];
    delete clientSockets[socket.id];
    if (socket.id === unmatched) unmatched = null;

    console.log(`> Client Disconnected: ${socket.id}`);
};


sockets.on('connection', (socket) => {
    
    joinGame(socket);
    
    const player = players[socket.id];
    // Once the socket has an opponent, we can begin the game
    if (getOpponent(socket)) {
        socket.emit("game.begin", {
            state: player
        });

        getOpponent(socket).emit("game.begin", {
            state: players[getOpponent(socket).id]
        });

        console.log(players);
    }

    // Listens for a move to be made and emits an event to both
    // players after the move is completed
    socket.on("make.move", function (cords) {
        if (!getOpponent(socket)) return;
        if (!player.playerTurn || player.isOver) return;
        if (player.isValidCords(cords.x, cords.y)) {
            // Stores the play
            player.storePlay(cords.x, cords.y, true); 
            players[getOpponent(socket).id].storePlay(cords.x, cords.y, false);
            
            // Check's for winner
            player.hasWinner();
            players[getOpponent(socket).id].hasWinner();

            // Emits changes
            socket.emit("move.made", {
                state: player
            });

            getOpponent(socket).emit("move.made", {
                state: players[getOpponent(socket).id]
            });
        }
    });

    socket.on("restart-game", function () { 
        player.restartBoard();
        if (getOpponent(socket)) {
            players[getOpponent(socket).id].restartBoard();

            const playerIsX = Math.round(Math.random());

            if (playerIsX) {
                player.playsFirst();
                players[getOpponent(socket).id].playsSecond();
            } else {
                player.playsSecond();
                players[getOpponent(socket).id].playsFirst();
            }

            getOpponent(socket).emit("restart.game", {
                state: players[getOpponent(socket).id]
            });

        } else {

            if (unmatched) {
                player.playerTurn = false;
                player.playerSymbol = 'O';
                player.opponentSymbol = 'X';
                player.opponent = unmatched;
                unmatched = null;
            } else {
                player.player
                unmatched = player.player;
            }

            

            if (getOpponent(socket)) {
                console.log(player.player, player.opponent);

                socket.emit("game.begin", {
                    state: player
                });
                
                getOpponent(socket).emit("game.begin", {
                    state: players[getOpponent(socket).id]
                });
            }
        }

        socket.emit("restart.game", {
            state: player
        });
    });
    
    // Emit an event to the opponent when the player leaves
    socket.on("disconnect", function () {
        
        if (getOpponent(socket)) {
            const opponent = getOpponent(socket).id;
            players[opponent].opponent = null;
            players[opponent].isOver = true;
            players[opponent].winner = players[opponent].playerSymbol;

            getOpponent(socket).emit("opponent.left");
        }
        removePlayer(socket);
    });


    socket.on("mousemove", data => {
        data.id = id;
        socket.broadcast.emit("moving", data);
    });
});



function joinGame(socket) {
    addPlayer(socket);

    if (unmatched) {
        players[socket.id].playerTurn = false;
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
    if (players[socket.id] && players[socket.id].opponent) {
        const opponentID = players[socket.id].opponent;
        return clientSockets[opponentID];
    }
    return;
}











server.listen(port, () => {
    console.log(`> Server is listening on port: ${port}`);
});