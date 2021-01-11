class Bot {
    
    constructor (symbol) {
        this.symbol = symbol;
    }

    makePlay(game) {
        
        if (game.numberOfCurrentPlay === 0) { // The Bot has the first play
            const topLeftCorner = 0;
            const topRightCorner = 1;
            const bottomRightCorner = 2;
            const bottomLeftCorner = 3;

            const randomCorner = Math.floor(Math.random() * 4);
            console.log(randomCorner);

            if (randomCorner === topLeftCorner) {
                game.board[0][0] = this.symbol;
            } else if (randomCorner === topRightCorner) {
                game.board[0][2] = this.symbol;
            } else if (randomCorner === bottomRightCorner) {
                game.board[2][2] = this.symbol;
            } else if (randomCorner === bottomLeftCorner) {
                game.board[2][0] = this.symbol;
            }
        }
    }
}

export {Bot};