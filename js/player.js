class Player {

    constructor(symbol) {
        this.symbol = symbol;
    }

    makePlay(cords, Game) {
        Game.storePlay(cords.x, cords.y, this.symbol);
        Game.renderPlays();

        Game.hasWinner();

        if (Game.isOver) return;

        // Next turn
        Game.nextTurn();
    }
}

export { Player };