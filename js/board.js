class CreateGame {

    constructor(player1Symbol, player2Symbol, untakenSpace, playAgainstComputer) {
        this.board = [
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace]
        ];
        this.numberOfCurrentPlay = 0;
        this.isOver = false;
        this.player1Turn = false;
        this.untakenSpace = untakenSpace;
        this.player1Symbol = player1Symbol;
        this.player2Symbol = player2Symbol;
        this.playAgainstComputer = playAgainstComputer;
    }

    isValidID(id) {
        if (id !== "" && !isNaN(id) && id.length == 2) {
            if (id[0] >= 0 && id[0] <= 2 && id[1] >= 0 && id[1] <= 2) {
                return true;
            }
        }
        return false;
    }

    isSpaceUntaken(x, y) {
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

    restartBoard() {

        // Clear board Array
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = [this.untakenSpace, this.untakenSpace, this.untakenSpace];
        }

        // Restart Game Variables
        this.isOver = false;
        this.numberOfCurrentPlay = 0;

    }

    checkGameState() {
        
        const hasOpenSpaces = () => {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board.length; j++) {
                    if (this.board[i][j] == this.untakenSpace) {
                        return true;
                    }
                }
            }
            return false;
        }
        
        const equals3 = (a, b, c) => {
            return a == b && b == c && a != this.untakenSpace;
        }

        if (!hasOpenSpaces()) { // Check for TIE
            return 'tie';
        }

        for (let i = 0; i < this.board.length; i++) { // Check for winner in ROWS
            if (equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
                // Winner found in ROW
                return this.board[i][0];
            }
        }

        for (let i = 0; i < this.board.length; i++) { // Check for winner in COLUMN
            if (equals3(this.board[0][i], this.board[1][i], this.board[2][i])) {
                // Winner found in COLUMN
                return this.board[0][i];
            }
        }

        if (equals3(this.board[0][0], this.board[1][1], this.board[2][2])) { // Check winner in diagonal left to right
            // Winner found in diagonal
            return this.board[0][0];
        }

        if (equals3(this.board[0][2], this.board[1][1], this.board[2][0])) { // Check winner in diagonal right to left
            // Winner found in diagonal
            return this.board[0][2];
        }

        return false;
    }

    nextTurn() {
        this.player1Turn = !this.player1Turn;
    }
}

export { CreateGame };