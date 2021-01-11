import {Bot} from "./bot.js";
import {CreateGame} from "./board.js"

const untakenSpace = 0;
const player1Symbol = "X";
const player2Symbol = "O";
const TIE = 9;

const Game = new CreateGame(player1Symbol, player2Symbol, untakenSpace);
console.log(Game);
const btnRestartGame = document.querySelector("button.restartGame");
const spaces = document.querySelectorAll(".square");

const bot = new Bot(player2Symbol);


function makePlay(event) {
    const space = event.target;
    const id = space.id;
    if (!Game.isOver && Game.isValidID(id) && Game.isSpaceUntaken(id)) {
        console.log(Game.player1Turn);
        const playerSymbol = Game.player1Turn ? player1Symbol : player2Symbol;
        const x = id[0];
        const y = id[1];

        Game.storePlay(x, y, playerSymbol);
        Game.renderPlays();

        Game.numberOfCurrentPlay++;
        
        if (Game.numberOfCurrentPlay === TIE) {
            Game.isOver = true;
            alert(`Game ended in a TIE.`);

        } else if (Game.gameHasWinner()) {
            Game.isOver = true;
            const winner = Game.player1Turn ? "Player1" : "Player2";
            alert(`${winner} wins.`);

        } else {
            Game.player1Turn = !Game.player1Turn;
        }
    }
}


function gameRestart() {
    Game.restartBoard();
    Game.renderPlays();
}


function init() {

    spaces.forEach(space => {
        space.addEventListener("click", makePlay);
    });

    btnRestartGame.addEventListener("click", gameRestart);

    //bot.makePlay(Game);
    //renderPlays();
}

init();