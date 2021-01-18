class Board {

    isSpaceUntaken(x, y, GameState) {
        return (GameState.board[x][y] === GameState.untakenSpace)
    }
    
    isValidID(id) {
        if (id !== "" && !isNaN(id) && id.length == 2) {
            if (id[0] >= 0 && id[0] <= 2 && id[1] >= 0 && id[1] <= 2) {
                return true;
            }
        }
        return false;
    }

    getCords(event, GameState) {
        const space = event.target;
        const id = space.id;
        if (this.isValidID(id) && this.isSpaceUntaken(id[0], id[1], GameState)) {
            return { x: id[0], y: id[1] };
        }
        return;
    }

    renderPlays(GameState) {
        for (let i = 0; i < GameState.board.length; i++) {
            const row = GameState.board[i];
            for (let k = 0; k < row.length; k++) {
                const cell = row[k];
                const spaceID = i.toString() + k.toString();
                const space = document.getElementById(spaceID);

                if (cell === GameState.playerSymbol) {
                    space.innerHTML = `<span class="play${GameState.playerSymbol}">${GameState.playerSymbol}</span>`;

                } else if (cell === GameState.opponentSymbol) {
                    space.innerHTML = `<span class="play${GameState.opponentSymbol}">${GameState.opponentSymbol}</span>`;

                } else if (cell === GameState.untakenSpace) {
                    space.innerHTML = '';
                }
            }
        }
    }

    displayTurn(GameState) {
        const div_current_turn = document.querySelector("div#gameInfo");
        const playerWithTurn = GameState.playerTurn ? 'your' : GameState.opponentSymbol;
        const classTurn = GameState.playerTurn ? `player${GameState.playerSymbol}` : `player${GameState.opponentSymbol}`;
        div_current_turn.innerHTML = `<span class="${classTurn}">It's ${playerWithTurn} turn!</span>`;
    }

    hasWinner(GameState) {
        if (GameState.isOver) {
            const div_current_turn = document.querySelector("div#gameInfo");
            const message = (GameState.winner === "draw") ? "The game ended in a draw." : (GameState.winner === GameState.playerSymbol) ? "<strong>YOU</strong> Win!" : `<strong>${GameState.winner}</strong> Wins!`;
            const classWinner = (GameState.winner === GameState.playerSymbol) ? `player${GameState.playerSymbol}Winner` : (GameState.winner === "draw") ? "gameDraw" : `player${GameState.opponentSymbol}Winner`;
            div_current_turn.innerHTML = `<span class="${classWinner}">${message}</span>`;
        }
    }



}

export { Board };