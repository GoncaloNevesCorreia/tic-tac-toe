let game = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

let player1Turn = true;

const player1Symbol = "X";
const player2Symbol = "O";


const spaces = document.querySelectorAll(".square");
spaces.forEach(space => {
    space.addEventListener("click", makePlay);
});


function makePlay(event) {
    const id = event.target.id;
    if (isValidID(id)) {
        if (player1Turn) {
            storePlay(id, player1Symbol);
        } else {
            storePlay(id, player2Symbol);
        }

        player1Turn = !player1Turn;
    }

    console.log(game);
}

function isValidID(id) {
    if (id !== "" && !isNaN(id) && id.length == 2) {
        if (id[0] >= 0 && id[0] <= 2 && id[1] >= 0 && id[1] <= 2) {
            return true;
        }
    }
    return false;
}

function storePlay(id, player) {
    const x = id[0];
    const y = id[1];

    game[x][y] = player;
}