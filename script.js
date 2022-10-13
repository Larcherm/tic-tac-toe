const Player = (name = "Player " + index, symbol, index) => {
    if (!name) {
        name = "Player " + index;
    }
    return {
        name, symbol, index, rounds:0
    };
}

const gameBoard = (() => {
    let boardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
    let moves = 0;
    let game_over = false;
    const board_cells = document.querySelectorAll(".board-cell");
    const newRound_button = document.getElementById("newround-button");
    const restart_button = document.getElementById("restart-button");
    const result = document.querySelector(".result-message")
    const banner = document.querySelector(".banner");
    const board_container = document.getElementById("board-container");

    board_cells.forEach(board_cell => board_cell.addEventListener("click", e => {
        let turn = game.getTurn();
        if (addSymbol(board_cell, turn)) {
            if (checkWinner(turn.index)) {
                postResult(`${turn.name.toUpperCase()} WON !!!`);
                game.incrementRounds();
                setBanner();
            }
            else if (moves >= 9) {
                postResult("IT'S A TIE !")
            }
            game.alternateTurn();
        };
    })) 
    
    newRound_button.addEventListener("click", e => {
        resetBoard();
    })

    restart_button.addEventListener("click", e => {
        restart();
    })


    function addSymbol(board_cell, turn) {
        if (board_cell.classList.contains("used") || game_over) {
            return false;
        }
        board_cell.classList.add("used");
        board_cell.textContent = turn.symbol;
        const row = board_cell.dataset.row;
        const column = board_cell.dataset.column;
        boardArray[row][column] = turn.index;
        moves++;
        return true;
    }

    function checkWinner(index) {
        row:
            for (let i = 0, l = boardArray.length; i < l; i++) {
                for (let j = 0, l2 =boardArray[i].length; j < l2; j++) {
                    if (boardArray[i][j] !== index) {
                        continue row;
                    }
                }
                return true;
            }
        column: 
            for (let i = 0, l = boardArray[i].length; i < l; i++) {
                for (let j = 0, l2 = boardArray.length; j < l2; j++) {
                    if (boardArray[j][i] !== index) {
                        continue column;
                    }
                    
                }
                return true;
            }
        if (boardArray[1][1] === index) {
            if ((boardArray[0][0] === index && boardArray[2][2] === index) || (boardArray[0][2] === index && boardArray[2][0] === index)) {
                return true;
            }
        }
        return false;
    }

    function resetBoard(){
        let cell_number = 0;
        for (let i = 0, l =  boardArray.length; i < l; i++) {
            for (let j = 0, l2 = boardArray[i].length; j < l2; j++) {
                boardArray[i][j] = "";
                let cell = document.getElementById("bc" + cell_number);
                cell.innerHTML = "";
                cell.classList.remove("used");
                cell_number++;
            }
        }
        game_over = false;
        moves = 0;
        result.textContent = "";
    }

    function postResult(message) {
        game_over = true;
        result.textContent = message;
    }

    function setBanner() {
        banner.style.display = "grid";
        document.querySelector(".banner-player1").textContent = game.getPlayer1().name;
        document.querySelector(".banner-player2").textContent = game.getPlayer2().name;
        document.querySelector(".rounds-player1").textContent = game.getPlayer1().rounds;
        document.querySelector(".rounds-player2").textContent = game.getPlayer2().rounds;
    }

    function restart() {
        banner.style.display = "none";
        resetBoard();
        board_container.style.display = "none";

    }
    return {boardArray, setBanner};

})();

const game = (() => {
    const start_button = document.getElementById("start-button");
    let turn, player1, player2;

    start_button.addEventListener("click", e => {
        document.getElementById("board-container").style.display = "flex";
        setPlayers();
        gameBoard.setBanner();
    })

    function alternateTurn() {
        if (turn === player1) {
            turn = player2;
            return;
        }
        else if (turn === player2) {
            turn = player1;
            return;
        }
    }

    function getTurn () {
        return turn;
    }

    function getPlayer1() {
        return player1;
    }

    function getPlayer2() {
        return player2;
    }

    function incrementRounds() {
        const player_list = [game.getPlayer1(), game.getPlayer2()];
        for (let player of player_list) {
            if (player === turn) player.rounds++;
        }
        
    }

    function setPlayers() {
        player1 = Player(document.getElementById("first-player").value, "X", 1);
        player2 = Player(document.getElementById("second-player").value, "0", 2);
        turn = player1;
    }

    return {getTurn, alternateTurn, getPlayer1, getPlayer2, incrementRounds};
})();
