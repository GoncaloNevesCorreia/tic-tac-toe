import { CreateGame } from "./board.js"

class Bot {

    constructor(symbol) {
        this.symbol = symbol;
    }

    minimax(Game, depth, isMaximizing) {
        const board = Game.board;
        console.log("In minimax: ", Game);

        let scores = {
            X: -10,
            O: 10,
            tie: 0
        };

        let result = Game.checkGameState(); // TODO! checkGameState inside minimax function.
        if (result !== false) {
            return scores[result];
        }
      
        if (isMaximizing) {
          let bestScore = -Infinity; // Get the MAX
          for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
              // Is the spot available?
              if (board[x][y] == Game.untakenSpace) {
                board[x][y] = Game.player2Symbol;
                let score = this.minimax(Game, depth + 1, false);
                board[x][y] = Game.untakenSpace;
                bestScore = Math.max(score, bestScore); // Maximizing player
              }
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity; // Get the MIN
          for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
              // Is the spot available?
              if (board[x][y] == Game.untakenSpace) {
                board[x][y] = Game.player1Symbol;
                let score = this.minimax(board, depth + 1, true);
                board[x][y] = Game.untakenSpace;
                bestScore = Math.min(score, bestScore); // Minimazing player
              }
            }
          }
          return bestScore;
        }
      }

    makePlay(Game) {
        console.log("In makePlay: ", Game);
        // AI to make its turn
        let bestScore = -Infinity;
        let move;
        
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                // Is the spot available?
                if (Game.board[x][y] == Game.untakenSpace) {
                    Game.board[x][y] = Game.player2Symbol;
                    let score = this.minimax(Game, 0, false);
                    Game.board[x][y] = Game.untakenSpace;
                    if (score > bestScore) {
                        bestScore = score;
                        move = { x, y };
                    }
                }
            }
        }

        Game.storePlay(move.x, move.y, this.symbol);
        Game.renderPlays();
        // Next turn
        Game.nextTurn();
        Game.numberOfCurrentPlay++;
    }
}

export { Bot };