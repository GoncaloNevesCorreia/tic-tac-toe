import { Bot } from "./bot.js";
import { Player } from "./player.js";
import { CreateGame } from "./board.js"

const untakenSpace = 0;
const player1Symbol = "X";
const player2Symbol = "O";
let playAgainstComputer = false;

const btnRestartGame = document.querySelector("button.restartGame");
const spaces = document.querySelectorAll(".square");

const Game = new CreateGame(player1Symbol, player2Symbol, untakenSpace, playAgainstComputer);
const player1 = new Player(player1Symbol);
const player2 = new Player(player2Symbol);
const bot = new Bot(player2Symbol);




function playerVsPlayer(event) {
    if (Game.isOver) return;

    const cords = Game.getCords(event);
    if (cords === undefined) return; // Invalid play

    if (Game.player1Turn) {
        player1.makePlay(cords, Game)
    } else {
        player2.makePlay(cords, Game);
    }
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
    Game.restartBoard();
    Game.renderPlays();

    if (Game.playAgainstComputer && !Game.player1Turn) bot.makePlay(Game);
}


function init() {
    Game.restartBoard();

    if (playAgainstComputer && !Game.player1Turn) {
        bot.makePlay(Game);
    }

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