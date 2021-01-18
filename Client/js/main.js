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

const div_yourSymbol = document.querySelector("div#yourSymbol");
const div_info = document.querySelector("div#gameInfo");
const btnRestartGame = document.querySelector("button.restartGame");
const spaces = document.querySelectorAll(".square");

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


function gameRestart() {
    
    socket.emit("restart-game");

    // Game.restartBoard();
    // Game.renderPlays();

    // if (Game.playAgainstComputer && !Game.player1Turn) bot.makePlay(Game);
}


function init() {

    

    socket.on('connect', () => {
        const playerID = socket.id;
        console.log(`> Player connected with id: ${playerID}`);

        div_info.textContent = "Waiting for oponent...";

    });

    socket.on('game.begin', (gameState) => {
        console.log(`> Receiving 'game.begin' event from server.`);
        Game = gameState.state;
        console.log(Game);
        clickHandlers(Game.playAgainstComputer);

        GameBoard.displayTurn(Game);
        div_yourSymbol.innerHTML = `You are <strong>${Game.playerSymbol}</strong>`;
    });

    socket.on('move.made', (gameState) => {
        Game = gameState.state;
        console.log(Game);

        GameBoard.displayTurn(Game);
        GameBoard.renderPlays(Game);

        GameBoard.hasWinner(Game);
    });

    socket.on('restart.game', (gameState) => {
        Game = gameState.state;
        console.log(Game);

        GameBoard.displayTurn(Game);
        GameBoard.renderPlays(Game);
        div_yourSymbol.innerHTML = `You are <strong>${Game.playerSymbol}</strong>`;
        
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

    btnRestartGame.addEventListener("click", gameRestart);
}


init();