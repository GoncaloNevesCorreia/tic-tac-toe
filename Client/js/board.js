class Board {
    constructor(player1ID, player2ID, untakenSpace, playAgainstComputer) {
        this.player1ID = player1ID;
        this.player2ID = player2ID;
        this.board = [
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace],
            [untakenSpace, untakenSpace, untakenSpace]
        ];
        this.isOver = false;
        this.player1Turn = true;
        this.untakenSpace = untakenSpace;
        this.player1Symbol = 'X';
        this.player2Symbol = 'O';
        this.playAgainstComputer = playAgainstComputer;
    }

    getCords(event) {
        const space = event.target;
        const id = space.id;
        if (this.isValidID(id) && this.isSpaceUntaken(id[0], id[1])) {
            return { x: id[0], y: id[1] };
        }
        return;
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

    displayTurn() {
        const div_current_turn = document.querySelector("div#gameInfo");
        const playerWithTurn = this.player1Turn ? this.player1Symbol : this.player2Symbol;
        const classTurn = this.player1Turn ? "player1Turn" : "player2Turn";
        div_current_turn.innerHTML = `<span class="${classTurn}">It's ${playerWithTurn} turn!</span>`;
    }

    hasWinner() {
        if (this.isOver) {
            const div_current_turn = document.querySelector("div#gameInfo");
            const message = (gameState === "draw") ? "The game ended in a draw." : `<strong>${gameState}</strong> Wins!`;
            const classWinner = (gameState === this.player1Symbol) ? "player1Winner" : (gameState === "draw") ? "gameDraw" : "player2Winner";
            div_current_turn.innerHTML = `<span class="${classWinner}">${message}</span>`;
        }
    }

}

export { Board };