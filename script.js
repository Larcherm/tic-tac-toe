const Player = (name, symbol, index) => {
    return {
        name, symbol, index
    };
}

const gameBoard = (() => {
    let boardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
    let moves = 0;
    let game_over = false;

    const board_cells = document.querySelectorAll(".board-cell");
    board_cells.forEach(board_cell => board_cell.addEventListener("click", e => {
        let turn = game.getTurn();
        if (addSymbol(board_cell, turn)) {
            game.alternateTurn();
            if (checkWinner(turn.index)) {
                game_over = true;
                const winner = document.createElement("h1");
                winner.textContent = `${turn.name.toUpperCase()} WON !!!`;
                document.getElementById("result-announcement").appendChild(winner);
            }
            else if (moves >= 9) {
                game_over = true;
                const tie = document.createElement("h1");
                tie.textContent = `IT'S A TIE !!!`;
                document.getElementById("result-announcement").appendChild(tie);
            }

        };
    })) 
    const start_button = document.getElementById("start-button");
    start_button.addEventListener("click", e => {
        console.log("hey");
        document.getElementById("board").style.display = "grid";
    })

    const restart_button = document.getElementById("restart-button");
    start_button.addEventListener("click", e => {
        console.log("hey");
        resetBoard();
    })


    function addSymbol(board_cell, turn) {
        if (board_cell.classList.contains("used") || game_over) {
            return false;
        }
        board_cell.classList.add("used");
        board_cell.textContent = turn.symbol;
        const classes = board_cell.classList;
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
    return {boardArray};

    function resetBoard(){
        let cell_number = 0;
        for (let i = 0, l =  boardArray.length; i < l; i++) {
            for (let j = 0, l2 = boardArray[i].length; j < l2; j++) {
                boardArray[i][j] = "";
                document.getElementById("bc" + cell_number).innerHTML = "";
                cell_number++;
            }
        }
    }
})();

const game = (() => {
    const player1 = Player("Player 1", "X", 0);
    const player2 = Player("Player 2", "0", 1);

    let turn = player1;

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

    return {getTurn, alternateTurn};
})();
