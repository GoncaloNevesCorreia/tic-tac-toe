import { Bot } from "./bot.js";
import { Player } from "./player.js";
import { Board } from "./board.js"

const socket = io();

const btnRestartGame = document.querySelector(".restartGame");
const spaces = document.querySelectorAll(".square");
const btnMultiplayer = document.querySelector("#btnMultiplayer");
const btnComputer = document.querySelector("#btnComputer");


const GameBoard = new Board();
let Game = {};

let userInfo = null;
let opponentInfo = null;


function playerVsPlayer(event) {
    if (Game.isOver) return;

    const cords = GameBoard.getCords(event, Game);
    if (cords === undefined) return; // Invalid play

    socket.emit("make.move", {
        x: cords.x,
        y: cords.y
    });
}

function playerVsBot(event) {
    if (Game.isOver || !Game.player1Turn) return; // Game over, or it's not the player's turn.

    const cords = Game.getCords(event);
    if (cords === undefined) return; // Invalid play

    player1.makePlay(cords, Game);

    if (Game.isOver) return;

    bot.makePlay(Game);
}


function init() {
    changeNameAction();
    getTopScores();

    socket.on('connect', () => {
        if (!getCookie("connection_id")) {
            setCookie("connection_id", socket.id);
        }

        socket.on('activeUserSession', () => {
            activeSessionWarning();
        });

        const playerID = socket.id;
        console.log(`> Player connected with id: ${playerID}`);

        GameBoard.waitingForOponent();

    });

    socket.on("authenticate", () => {
        const cookie = getCookie("connection_id");
        socket.emit("authentication", cookie);
    });

    socket.on("userInfo", (playerInfo) => {
        userInfo = playerInfo;

        updateInfo();
    });

    socket.on("changed.name", (name) => {
        userInfo.name = name;
        updateInfo();
    });

    socket.on("opponent.changed.name", (name) => {
        opponentInfo.name = name;

        updateInfo();
    });


    socket.on('game.begin', (gameState) => {
        console.log(gameState.opponentInfo);

        userInfo = gameState.playerInfo;
        opponentInfo = gameState.opponentInfo;
        Game = gameState.state;

        updateInfo();

        clickHandlers(Game.playAgainstComputer);

        GameBoard.displayTurn(Game);
        GameBoard.displaySymbol(Game.playerSymbol);
    });

    socket.on('move.made', (gameState) => {
        Game = gameState.state;
        userInfo = gameState.playerInfo;
        opponentInfo = gameState.opponentInfo;

        console.log("Game State", gameState);
        console.log("User Info:", userInfo);
        console.log("Opponent Info", opponentInfo);

        updateInfo();


        GameBoard.displayTurn(Game);
        GameBoard.renderPlays(Game);

        GameBoard.hasWinner(Game);

    });

    socket.on('restart.game', (gameState) => {
        Game = gameState.state;
        userInfo = gameState.playerInfo;

        updateInfo();


        GameBoard.renderPlays(Game);
        btnRestartGame.textContent = "Restart";

        if (gameState.opponentInfo) {
            opponentInfo = gameState.opponentInfo;
            GameBoard.displayTurn(Game);
            GameBoard.displaySymbol(Game.playerSymbol);
        } else {
            GameBoard.waitingForOponent();
        }
    });

    socket.on('opponent.left', () => {
        opponentInfo = null;
        GameBoard.opponentDisconnected();
        updateInfo();
    });
}

function changeNameAction() {
    const btnChangeName = document.querySelector("#btnChangeName");

    btnChangeName.addEventListener("click", () => {
        const nameInput = document.querySelector("#idName");
        if (nameInput.value !== "") {
            socket.emit("change.name", nameInput.value);
        }
    });
}


function clickHandlers(playAgainstComputer) {


    spaces.forEach(space => {
        if (playAgainstComputer) {
            space.addEventListener("click", playerVsBot);
        } else {
            space.addEventListener("click", playerVsPlayer);
        }
    });




    btnMultiplayer.addEventListener("click", () => {
        socket.emit("multiplayer.game");
    });

    btnComputer.addEventListener("click", () => {
        socket.emit("computer.game");
    });

    btnRestartGame.addEventListener("click", () => {
        socket.emit("restart.game");
    });
}

function updateInfo() {
    const playerDiv = document.querySelector(".player");
    const opponentDiv = document.querySelector(".opponent");
    if (userInfo) playerDiv.innerHTML = `<span id="yourUsername">${userInfo.name}</span> (YOU): <span class="score">${userInfo.score} games won!</span>`;
    if (opponentInfo) {
        opponentDiv.innerHTML = `<span id="opponentUsername">${opponentInfo.name} </span>: <span class="score">${opponentInfo.score} games won!</span>`;
    } else {
        opponentDiv.innerHTML = "";
    }
}

function activeSessionWarning() {
    const gameInfo = document.querySelector("#gameInfo");
    gameInfo.innerHTML = "<span class='error'>There is already an active game session!</span>";
}

function setCookie(name, value) {
    var expires = "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie = `${name}=${value};${expires}; path=/`;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function showTopScores(users) {
    const div_TopScores = document.querySelector("#top_scores .users");
    let allUsers = "";
    users.forEach((user, index) => {
        allUsers += `
        <div class="user">
            ${index + 1}º.
            <span class="name">${user.name}</span>
            <span class="score">${user.score} games Won</span>
        </div>
        `;
    });

    div_TopScores.innerHTML = allUsers;
}

async function getTopScores() {
    const protocole = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;

    const response = await fetch(`${protocole}//${host}:${port}/topscores`);
    const responseJSON = await response.json();

    showTopScores(responseJSON);


    setInterval(getTopScores, 60000);
}

init();