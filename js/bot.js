class Bot {

    constructor(symbol) {
        this.symbol = symbol;
    }

    makePlay(Game) {



        let bestScore = -Infinity;
        let bestMove;

        let scores = {
            X: (Game.player1Symbol === 'X') ? -10 : 10,
            O: (Game.player2Symbol === 'O' ? 10 : -10),
            tie: 0
        };

        for (let x = 0; x < Game.board.length; x++) {
            for (let y = 0; y < Game.board.length; y++) {
                if (Game.isSpaceUntaken(x, y)) {
                    let score = minimax(Game.board, 0, true);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { x, y };
                    }
                }
            }
        }



        function minimax(board, depth, isMaximizing) {
            const player1State = Game.checkGameState(Game.player1Symbol);
            const computerState = Game.checkGameState(Game.player2Symbol);

            if (computerState === 'tie' || player1State === 'tie') return scores.tie;

            if (player1State !== false) {
                return scores[Game.player1Symbol];

            } else if (computerState !== false) {

                return scores[Game.player2Symbol];
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let x = 0; x < Game.board.length; x++) {
                    for (let y = 0; y < Game.board.length; y++) {
                        if (Game.isSpaceUntaken(x, y)) {
                            board[x][y] = Game.player2Symbol;

                            let score = minimax(board, depth + 1, false);
                            board[x][y] = Game.untakenSpace;
                            if (score > bestScore) {
                                bestScore = score;
                            }
                        }
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let x = 0; x < Game.board.length; x++) {
                    for (let y = 0; y < Game.board.length; y++) {
                        if (Game.isSpaceUntaken(x, y)) {
                            board[x][y] = Game.player1Symbol;

                            let score = minimax(board, depth + 1, true);
                            board[x][y] = Game.untakenSpace;
                            if (score < bestScore) {
                                bestScore = score;
                            }
                        }
                    }
                }
                return bestScore;
            }
        }






        Game.storePlay(bestMove.x, bestMove.y, this.symbol);
        Game.renderPlays();
        Game.numberOfCurrentPlay++;
    }


}

export { Bot };