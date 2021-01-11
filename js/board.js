class CreateGame {
    
    constructor(player1Symbol, player2Symbol, untakenSpace) {
        this.board = [
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace]
        ],
        this.numberOfCurrentPlay = 0,
        this.isOver = false,
        this.player1Turn = true
        this.untakenSpace = untakenSpace;
        this.player1Symbol = player1Symbol;
        this.player2Symbol = player2Symbol;
    }

    isValidID(id) {
        if (id !== "" && !isNaN(id) && id.length == 2) {
            if (id[0] >= 0 && id[0] <= 2 && id[1] >= 0 && id[1] <= 2) {
                return true;
            }
        }
        return false;
    }

    isSpaceUntaken(id) {
        const x = id[0];
        const y = id[1];
    
        return (this.board[x][y] === this.untakenSpace)
    }

    storePlay(x, y, player) {
        this.board[x][y] = player;
    }

    renderPlays() {
        for (let i = 0; i < this.board.length; i++) {
            const row = this.board[i];
            for (let k = 0; k < row.length; k++) {
                const cell = row[k];
                const spaceID = i.toString() + k.toString(); 
                const space = document.getElementById(spaceID);
    
                if (cell === this.player1Symbol) {
                    space.innerHTML = `<span class="play1">${this.player1Symbol}</span>`;
    
                } else if (cell === this.player2Symbol) {
                    space.innerHTML = `<span class="play2">${this.player2Symbol}</span>`;
    
                } else if (cell === this.untakenSpace) {
                    space.innerHTML = '';
    
                }
            }
        }    
    }

    gameHasWinner() {
        const thereIsAWinner = true;
        const playerSymbol = this.player1Turn ? this.player1Symbol : this.player2Symbol;
        
        if (this.numberOfCurrentPlay >= 5) {
            for (let i = 0; i < this.board.length; i++) { // Check for winner in ROWS
                if (this.board[i][0] === playerSymbol &&
                    this.board[i][1] === playerSymbol &&
                    this.board[i][2] === playerSymbol) {
                        // Winner found in ROW
                        return thereIsAWinner;
                    }
            }
    
            for (let i = 0; i < this.board.length; i++) { // Check for winner in COLUMN
                if (this.board[0][i] === playerSymbol &&
                    this.board[1][i] === playerSymbol &&
                    this.board[2][i] === playerSymbol) {
                        // Winner found in COLUMN
                        return thereIsAWinner;
                    }
            }
    
            if (this.board[0][0] === playerSymbol &&
                this.board[1][1] === playerSymbol &&
                this.board[2][2] === playerSymbol) { // Check winner in diagonal left to right
                // Winner found in diagonal
                return thereIsAWinner;
            }
    
            if (this.board[0][2] === playerSymbol &&
                this.board[1][1] === playerSymbol &&
                this.board[2][0] === playerSymbol) { // Check winner in diagonal right to left
                // Winner found in diagonal
                return thereIsAWinner;
            }
    
        }
        return !thereIsAWinner;
    }

    restartBoard() {

        // Clear board Array
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = [this.untakenSpace, this.untakenSpace, this.untakenSpace];
        }
    
        // Restart Game Variables
        this.isOver = false;
        this.numberOfCurrentPlay = 0;
    
    }
}

export {CreateGame};