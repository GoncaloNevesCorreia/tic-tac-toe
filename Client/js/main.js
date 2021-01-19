import { Bot } from "./bot.js";
import { Player } from "./player.js";
import { Board } from "./board.js"

// const untakenSpace = 0;
// const player1Symbol = "X";
// const player2Symbol = "O";
// let playAgainstComputer = false;
// const Game = new CreateGame(player1Symbol, player2Symbol, untakenSpace, playAgainstComputer);
// const player1 = new Player(player1Symbol);
// const player2 = new Player(player2Symbol);
// const bot = new Bot(player2Symbol);

const socket = io();

const btnRestartGame = document.querySelector(".restartGame");
const spaces = document.querySelectorAll(".square");
const btnMultiplayer = document.querySelector("#btnMultiplayer");
const btnComputer = document.querySelector("#btnComputer");


const GameBoard = new Board();
let Game = {};





function playerVsPlayer(event) {
    if (Game.isOver) return;

    const cords = GameBoard.getCords(event, Game);
    if (cords === undefined) return; // Invalid play

    socket.emit("make.move", {
        x: cords.x,
        y: cords.y
    });
}

function playerVsBot(event) {
    if (Game.isOver || !Game.player1Turn) return; // Game over, or it's not the player's turn.

    const cords = Game.getCords(event);
    if (cords === undefined) return; // Invalid play

    player1.makePlay(cords, Game);

    if (Game.isOver) return;

    bot.makePlay(Game);
}





function init() {

    socket.on('connect', () => {
        const playerID = socket.id;
        console.log(`> Player connected with id: ${playerID}`);

        GameBoard.waitingForOponent();

    });

    socket.on('game.begin', (gameState) => {
        Game = gameState.state;

        clickHandlers(Game.playAgainstComputer);

        GameBoard.displayTurn(Game);
        GameBoard.displaySymbol(Game.playerSymbol);
    });

    socket.on('move.made', (gameState) => {
        Game = gameState.state;

        GameBoard.displayTurn(Game);
        GameBoard.renderPlays(Game);

        GameBoard.hasWinner(Game);
    });

    socket.on('restart.game', (gameState) => {
        Game = gameState.state;

        GameBoard.renderPlays(Game);
        btnRestartGame.textContent = "Restart";

        if (Game.opponent) {
            GameBoard.displayTurn(Game);
            GameBoard.displaySymbol(Game.playerSymbol);
        } else {
            GameBoard.waitingForOponent();
        }
    });

    socket.on('opponent.left', () => {
        GameBoard.opponentDisconnected();
    });
}


function clickHandlers(playAgainstComputer) {


    spaces.forEach(space => {
        if (playAgainstComputer) {
            space.addEventListener("click", playerVsBot);
        } else {
            space.addEventListener("click", playerVsPlayer);
        }
    });


    btnMultiplayer.addEventListener("click", () => {
        socket.emit("multiplayer.game");
    });

    btnComputer.addEventListener("click", () => {
        socket.emit("computer.game");
    });

    btnRestartGame.addEventListener("click", () => {
        socket.emit("restart.game");
    });
}


init();