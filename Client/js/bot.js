class Bot {

    constructor(symbol) {
        this.symbol = symbol;
    }



    makePlay(Game) {
        const minimax = (board, depth, isMaximizing) => {

            let scores = { draw: 0 };
            scores[Game.player1Symbol] = -10;
            scores[Game.player2Symbol] = 10;

            let result = Game.checkGameState();
            if (result !== false) {
                if (result === Game.player1Symbol) { // Derrota
                    return scores[result] - depth;
                } else if (result === Game.player2Symbol) {
                    return scores[result] - depth; // Vitoria
                } else { // Empate
                    return scores[result];
                }
            }

            if (isMaximizing) {
                let bestScore = -Infinity; // Get the MAX
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        // Is the spot available?
                        if (board[x][y] == Game.untakenSpace) {
                            board[x][y] = Game.player2Symbol;
                            let score = minimax(board, depth + 1, false);
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
                            let score = minimax(board, depth + 1, true);
                            board[x][y] = Game.untakenSpace;
                            bestScore = Math.min(score, bestScore); // Minimazing player
                        }
                    }
                }
                return bestScore;
            }
        }

        // AI to make its turn
        let bestScore = -Infinity;
        let move;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                // Is the spot available?
                if (Game.board[x][y] == Game.untakenSpace) {
                    Game.board[x][y] = Game.player2Symbol;
                    let score = minimax(Game.board, 0, false);
                    Game.board[x][y] = Game.untakenSpace;
                    if (score > bestScore) {
                        bestScore = score;
                        move = { x, y };
                    }
                }
            }
        }

        setTimeout(() => {
            Game.storePlay(move.x, move.y, this.symbol);
            Game.renderPlays();
            Game.hasWinner();


            if (Game.isOver) return;
            // Next turn
            Game.nextTurn();
        }, 1000);

    }
}

export { Bot };