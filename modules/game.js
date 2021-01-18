export default class CreateGame {

    constructor(player1, player2ID, untakenSpace, playAgainstComputer) {
        this.player = player1;
        this.opponent = player2ID;
        this.board = [
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace]
        ];
        this.isOver = false;
        this.winner = null;
        this.player1Turn = true;
        this.untakenSpace = untakenSpace;
        this.playerSymbol = 'X';
        this.opponentSymbol = 'O';
        this.playAgainstComputer = playAgainstComputer;
    }

    // Checks the id from Client-Side
    isValidID(id) {
        if (id !== "" && !isNaN(id) && id.length == 2) {
            if (id[0] >= 0 && id[0] <= 2 && id[1] >= 0 && id[1] <= 2) {
                return true;
            }
        }
        return false;
    }

    // Checks if the space is untaken
    isSpaceUntaken(x, y) {
        return (this.board[x][y] === this.untakenSpace)
    }

    // Stores play in board 
    storePlay(x, y, player) {
        this.board[x][y] = player;
    }




    restartBoard() {

        // Clear board Array
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = [this.untakenSpace, this.untakenSpace, this.untakenSpace];
        }

        // Restart Game Variables
        this.isOver = false;

        // Generate Random Turn
        this.player1Turn = Math.round(Math.random());

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

        if (!hasOpenSpaces()) { // Check for DRAW
            return 'draw';
        }

        return false;
    }

    nextTurn() {
        this.player1Turn = !this.player1Turn;

    }


    hasWinner() {
        const gameState = this.checkGameState();

        if (gameState !== false) {
            this.isOver = true;
            this.winner = gameState;
        }
    }
}