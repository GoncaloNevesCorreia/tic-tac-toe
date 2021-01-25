const express = require('express');
const http = require('http');
const { CreateGame } = require('./modules/game.js');
const { User } = require('./modules/user.js');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const port = process.env.PORT || 3000;


const untakenSpace = 0;
const playAgainstComputer = false;

let users = new User();
const clientSockets = {};
const players = {};

let unmatched = null;



app.use(express.static('Client'));


users.syncWithUsersDB();

const addPlayer = socket => {
    clientSockets[socket.id] = socket;
    const game = new CreateGame(socket.id, unmatched, untakenSpace, playAgainstComputer);
    players[socket.id] = game;
};

const removePlayer = socket => {
    delete players[socket.id];
    delete clientSockets[socket.id];
    if (socket.id === unmatched) unmatched = null;
};



sockets.on('connection', (socket) => {

    // try to get the cookie
    let cookie = getCookie(socket);

    // if it has cookie    
    if (cookie) {

        // try to get user
        let user = users.getUser(cookie);

        // if it has user
        if (user) {
            // updates session
            if (!user.online) user.temp_session_id = socket.id;

        } else {
            // Add user to the list
            user = users.addUser(cookie, socket.id);
        }

        if (!user.online) {
            user.online = true;
            socket.emit("userInfo", {
                name: user.name,
                score: user.gamesWon
            });

            console.log(`> User Connected: ${user.name}`);
            gameStart(socket, cookie);
        } else {
            socket.emit("activeUserSession");
        }

    } else {
        // if it didn't found the cookie it emit an "authenticate" event to the client
        socket.emit("authenticate");
    }

    socket.on("authentication", function(client_cookie) {

        // If it has the cookie
        if (client_cookie) {
            // Add user to the list
            const user = users.addUser(client_cookie, socket.id);
            cookie = client_cookie;

            user.online = true;
            socket.emit("username", user.name);
            gameStart(socket, cookie);
        } else {
            // if it didn't found the cookie it emit an "authenticate" event to the client, again
            socket.emit("authenticate");
        }
    })
});



function joinGame(socket) {
    addPlayer(socket);

    if (unmatched && unmatched !== socket.id) {
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


function getCookie(socket) {
    if (socket.request.headers.cookie) {
        const name = 'connection_id';
        const nameEQ = name + "=";
        var ca = socket.request.headers.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function gameStart(socket, cookie) {


    socket.on("change.name", (name) => {
        if (name !== "") {
            // Cookie -> session_id
            users.changeName(cookie, name);

            socket.emit("changed.name", name);

            if (getOpponent(socket)) {
                getOpponent(socket).emit("opponent.changed.name", name);
            }
        }
    });


    joinGame(socket);
    const player = players[socket.id];
    const user = users.getUserByCurrent_Session_ID(player.player);

    let opponent = players[player.opponent];
    let userOponent = users.getUserByCurrent_Session_ID(player.opponent);


    // Once the socket has an opponent, we can begin the game
    if (getOpponent(socket)) {
        opponent = players[player.opponent];
        userOponent = users.getUserByCurrent_Session_ID(player.opponent);

        socket.emit("game.begin", {
            state: player,
            playerInfo: {
                name: user.name,
                score: user.gamesWon
            },
            opponentInfo: {
                name: userOponent.name,
                score: userOponent.gamesWon
            }
        });



        getOpponent(socket).emit("game.begin", {
            state: opponent,
            playerInfo: {
                name: userOponent.name,
                score: userOponent.gamesWon
            },
            opponentInfo: {
                name: user.name,
                score: user.gamesWon
            }
        });


    }

    // Listens for a move to be made and emits an event to both
    // players after the move is completed
    socket.on("make.move", function(cords) {
        if (!getOpponent(socket)) return;
        if (!player.playerTurn || player.isOver) return;
        if (player.isValidCords(cords.x, cords.y)) {
            opponent = players[player.opponent];
            userOponent = users.getUserByCurrent_Session_ID(player.opponent);

            // Stores the play
            player.storePlay(cords.x, cords.y, true);
            opponent.storePlay(cords.x, cords.y, false);

            // Check's for winner
            player.hasWinner();
            opponent.hasWinner();


            if (player.isOver) {
                if (player.playerSymbol === player.winner) {
                    users.updateUserScore(user.session_id);
                } else {
                    users.updateUserScore(userOponent.session_id);
                }
            }

            // Emits changes
            socket.emit("move.made", {
                state: player,
                playerInfo: {
                    name: user.name,
                    score: user.gamesWon
                },
                opponentInfo: {
                    name: userOponent.name,
                    score: userOponent.gamesWon
                }
            });

            getOpponent(socket).emit("move.made", {
                state: opponent,
                playerInfo: {
                    name: userOponent.name,
                    score: userOponent.gamesWon
                },
                opponentInfo: {
                    name: user.name,
                    score: user.gamesWon
                }
            });
        }
    });

    socket.on("restart.game", function() {
        player.restartBoard();
        if (getOpponent(socket)) {
            userOponent = users.getUserByCurrent_Session_ID(player.opponent);

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
                state: players[getOpponent(socket).id],
                playerInfo: {
                    name: userOponent.name,
                    score: userOponent.gamesWon
                },
                opponentInfo: {
                    name: user.name,
                    score: user.gamesWon
                }
            });

        } else {

            if (unmatched && unmatched !== socket.id) {
                player.playerTurn = false;
                player.playerSymbol = 'O';
                player.opponentSymbol = 'X';
                player.opponent = unmatched;
                players[unmatched].opponent = player.player;
                unmatched = null;
            } else {
                unmatched = player.player;
            }

            if (getOpponent(socket)) {
                userOponent = users.getUserByCurrent_Session_ID(player.opponent);

                // Emits changes
                socket.emit("game.begin", {
                    state: player,
                    playerInfo: {
                        name: user.name,
                        score: user.gamesWon
                    },
                    opponentInfo: {
                        name: userOponent.name,
                        score: userOponent.gamesWon
                    }
                });

                getOpponent(socket).emit("game.begin", {
                    state: players[getOpponent(socket).id],
                    playerInfo: {
                        name: userOponent.name,
                        score: userOponent.gamesWon
                    },
                    opponentInfo: {
                        name: user.name,
                        score: user.gamesWon
                    }
                });
            }
        }


        if (player.opponent) {
            userOponent = users.getUserByCurrent_Session_ID(player.opponent);

            // Emits changes
            socket.emit("restart.game", {
                state: player,
                playerInfo: {
                    name: user.name,
                    score: user.gamesWon
                },
                opponentInfo: {
                    name: userOponent.name,
                    score: userOponent.gamesWon
                }
            });
        } else {
            // Emits changes
            socket.emit("restart.game", {
                state: player,
                playerInfo: {
                    name: user.name,
                    score: user.gamesWon
                }
            });
        }
    });

    // Emit an event to the opponent when the player leaves
    socket.on("disconnect", function() {
        const user = users.getUserByCurrent_Session_ID(socket.id);
        user.online = false;
        if (getOpponent(socket)) {
            const opponent = getOpponent(socket).id;
            players[opponent].opponent = null;
            players[opponent].isOver = true;
            players[opponent].winner = players[opponent].playerSymbol;

            getOpponent(socket).emit("opponent.left");
        }

        console.log(`> User disconnected: ${user.name}`);
        removePlayer(socket);
    });
}


app.get('/topscores', function(req, res) {
    let topScores = users.getTopScores(10);
    let jsonObj = JSON.stringify(topScores, null, 2);
    res.send(jsonObj);
})