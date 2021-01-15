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
    console.log(Game.isOver);
    if (Game.isOver) return;

    player1.makePlay(event, Game);
    let gameState = Game.checkGameState();

    if (gameState !== false) {
        Game.isOver = true;
        alert(gameState)
    };

    if (Game.isOver) return;

    // Next turn
    Game.nextTurn();

    bot.makePlay(Game);
    //bestMove();

    gameState = Game.checkGameState();

    if (gameState !== false) {
        Game.isOver = true;
        alert(gameState)
    };
    
    
}


function gameRestart() {
    Game.restartBoard();
    Game.renderPlays();
}


function init() {

    if (playAgainstComputer) {
        //Game.player1Turn = Math.round(Math.random());
        Game.player1Turn = false;

        if (!Game.player1Turn) {
            bot.makePlay(Game);
            //bestMove();

            // Next turn
            Game.nextTurn();
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

// function bestMove() {
//     // AI to make its turn
//     let bestScore = -Infinity; // Get the MAX
//     let move;
//     for (let i = 0; i < 3; i++) {
//       for (let j = 0; j < 3; j++) {
//         // Is the spot available?
//         if (Game.board[i][j] == Game.untakenSpace) {
//           Game.board[i][j] = Game.player2Symbol;
//           let score = minimax(Game.board, 0, false);
//           Game.board[i][j] = Game.untakenSpace;
//           if (score > bestScore) {
//             bestScore = score; // Maximizing player
//             move = { i, j };
//           }
//         }
//       }
//     }
    
//     Game.storePlay(move.i, move.j, Game.player2Symbol);
    
//     Game.renderPlays();
//     // Next turn
//     Game.nextTurn();
//     Game.numberOfCurrentPlay++;
//   }
  
//   let scores = {
//     X: -10,
//     O: 10,
//     tie: 0
//   };
  
//   function minimax(board, depth, isMaximizing) {
//     let result = Game.checkGameState();
//     if (result !== false) {
//         return scores[result];
//     }
  
//     if (isMaximizing) {
//       let bestScore = -Infinity; // Get the MAX
//       for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//           // Is the spot available?
//           if (board[i][j] == Game.untakenSpace) {
//             board[i][j] = Game.player2Symbol;
//             let score = minimax(board, depth + 1, false);
//             board[i][j] = Game.untakenSpace;
//             bestScore = Math.max(score, bestScore); // Maximizing player
//           }
//         }
//       }
//       return bestScore;
//     } else {
//       let bestScore = Infinity; // Get the MIN
//       for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//           // Is the spot available?
//           if (board[i][j] == Game.untakenSpace) {
//             board[i][j] = Game.player1Symbol;
//             let score = minimax(board, depth + 1, true);
//             board[i][j] = Game.untakenSpace;
//             bestScore = Math.min(score, bestScore); // Minimazing player
//           }
//         }
//       }
//       return bestScore;
//     }
//   }

init();


