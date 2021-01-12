class Player {

    constructor(symbol) {
        this.symbol = symbol;
    }

    makePlay(event, Game) {
        const space = event.target;
        const id = space.id;
        if (Game.isValidID(id) && Game.isSpaceUntaken(id[0], id[1])) {
            const x = id[0];
            const y = id[1];

            Game.storePlay(x, y, this.symbol);
            Game.renderPlays();

            Game.numberOfCurrentPlay++;

        }
    }
}

export { Player };