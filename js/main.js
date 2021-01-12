import { Bot } from "./bot.js";
import { Player } from "./player.js";
import { CreateGame } from "./board.js"

const untakenSpace = 0;
const player1Symbol = "X";
const player2Symbol = "O";
const TIE = 9;
const playAgainstComputer = true;

const Game = new CreateGame(player1Symbol, player2Symbol, untakenSpace, playAgainstComputer);
const btnRestartGame = document.querySelector("button.restartGame");
const spaces = document.querySelectorAll(".square");

const player1 = new Player(player1Symbol);
const player2 = new Player(player2Symbol);

const bot = new Bot(player2Symbol);




function playerVsPlayer(event) {
    if (Game.isOver) return;

    if (Game.player1Turn) {
        player1.makePlay(event, Game)
    } else {
        player2.makePlay(event, Game);
    }

    if (Game.numberOfCurrentPlay === TIE) { // Check for TIE
        Game.isOver = true;
        alert(`Game ended in a TIE.`);

    } else if (Game.gameHasWinner()) { // Check for Winner
        Game.isOver = true;
        const winner = Game.player1Turn ? "Player1" : "Player2";
        alert(`${winner} wins.`);

    } else { // Next turn
        Game.player1Turn = !Game.player1Turn;
    }
}

function playerVsBot(event) {
    if (Game.isOver) return;

    player1.makePlay(event, Game);
    let gameState = Game.checkGameState();

    if (gameState !== null) alert(gameState);

    // Next turn
    Game.nextTurn();

    bot.makePlay(Game);
    gameState = Game.checkGameState();
    if (gameState !== null) alert(gameState);

    // Next turn
    Game.nextTurn();
}


function gameRestart() {
    Game.restartBoard();
    Game.renderPlays();
}


function init() {

    if (playAgainstComputer) {
        Game.player1Turn = Math.round(Math.random());

        if (!Game.player1Turn) {
            bot.makePlay(Game);
        }

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