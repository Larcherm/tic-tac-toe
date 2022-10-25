const Player = (name = "Player " + index, symbol, index, ai = false) => {
    if (!name) {
        name = "Player " + index;
    }
    return {
        name, symbol, index, rounds:0, ai
    };
}

const gameBoard = (() => {
    let boardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
    let moves = 0;
    let game_over = false;
    let winner;
    const board_cells = document.querySelectorAll(".board-cell");
    const newRound_button = document.getElementById("newround-button");
    const restart_button = document.getElementById("restart-button");
    const result = document.querySelector(".result-message")
    const banner = document.querySelector(".banner");
    const board_container = document.getElementById("board-container");
    const form = document.getElementById("form");

    form.addEventListener("submit", e => {
        e.preventDefault();
    })

    board_cells.forEach(board_cell => board_cell.addEventListener("click", e => {
        let turn = game.getTurn();
        if (addSymbol(board_cell, turn)) {
            if (checkWinner(boardArray, turn.index)) {
                postResult(`${turn.name.toUpperCase()} WON THE ROUND!!!`);
                game.incrementRounds();
                setBanner();
            }
            incrementMoves();
            if (moves >= 9) {
                postResult("IT'S A TIE !");
            }
            game.alternateTurn();
            ai.makeMove(game.getTurn(), boardArray, moves, game_over);    
        };
    })) 
    
    newRound_button.addEventListener("click", e => {
        resetBoard();
        ai.makeMove(game.getTurn(), boardArray, moves);
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
        return true;
    }

    function checkWinner(board = boardArray, index) {
        row:
            for (let i = 0, l = board.length; i < l; i++) {
                for (let j = 0, l2 = board[i].length; j < l2; j++) {
                    if (board[i][j] !== index) {
                        continue row;
                    }
                }
                return true;
            }
        column: 
            for (let i = 0, l = board[0].length; i < l; i++) {
                for (let j = 0, l2 = board.length; j < l2; j++) {
                    if (board[j][i] !== index) {
                        continue column;
                    }
                    
                }
                return true;
            }
        if (board[1][1] === index) {
            if ((board[0][0] === index && board[2][2] === index) || (board[0][2] === index && board[2][0] === index)) {
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
        game.alternateTurn(3);
        ai.makeMove(game.getTurn(), boardArray, moves, game_over);

    }

    function postResult(message) {
        game_over = true;
        result.textContent = message;
        game.incrementTotalrounds();
    }

    function setBanner() {
        banner.style.display = "grid";
        document.querySelector(".banner-player1").textContent = game.getPlayer1().name;
        document.querySelector(".banner-player2").textContent = game.getPlayer2().name;
        document.querySelector(".rounds-player1").textContent = game.getPlayer1().rounds;
        document.querySelector(".rounds-player2").textContent = game.getPlayer2().rounds;

    }

    function restart() {
        game.incrementTotalrounds(0);
        game.alternateTurn(1);
        banner.style.display = "none";
        resetBoard();
        board_container.style.display = "none";
    }

    function updateBoard(row, col, value) {
        boardArray[row][col] = value;
        return;
        // let boardIndex = 0;
        // for(let i = 0; i < 3; i++) {
        //     for (let j = 0; j < 3; j++){
        //         boardArray[i][j] = newBoard[boardIndex];
        //         boardIndex++;
                
        //     }
        // }
    }

    function incrementMoves() {
        moves++;
    }

    function getBoard() {
        return boardArray;
    }

    return {setBanner, updateBoard, moves, incrementMoves, checkWinner, getBoard, postResult};
})();

const game = (() => {
    const start_button = document.getElementById("start-button");
    const radio_result = document.getElementsByName("opponent");
    let rounds = 0;
    let turn, player1, player2;

    start_button.addEventListener("click", e => {
        setPlayers();
        gameBoard.setBanner();
        document.getElementById("board-container").style.display = "flex";
    })

    function alternateTurn(index=0) {
        if (!index) {
            if (turn === player1) {
                    turn = player2;
            }
            else if (turn === player2) {
                turn = player1;
            }
        }
        else if(index === 1) {
            turn = player1;
        }
        else if(index === 2) {
            turn = player2;
        }
        else if (index === 3) {
            if (rounds % 2 === 0) turn = player1;
            else turn = player2;
        }
        return;
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

    function incrementTotalrounds(reset = 1) {
        if (reset != 1) rounds = 0;
        else rounds++;

    }

    function setPlayers() {
        player1 = Player(document.getElementById("first-player").value, "X", 1);
        for (let option of radio_result) {
            if (option.checked) {
                if (option.value === "human") {
                player2 = Player(document.getElementById("second-player").value, "0", 2);
                }
                else {
                    player2 = Player("Computer", "0", 2, true);
                }
            }
        }
        turn = player1;
    }

    return {getTurn, alternateTurn, getPlayer1, getPlayer2, incrementRounds, incrementTotalrounds};
})();

const ai = (() => { 

    function makeMove(turn, board, moves, game_over) {
        console.log("makemove");
        if (turn.ai === false || game_over) {
            return;
        }
        let bestScore = -1000;
        let bestMoveRow, bestMoveCol;
        for (let i = 0, l = board.length; i < l ; i++) {
            for (let j = 0, l2 = board[i].length; j < l2; j++) {
                if (!board[i][j]) {
                    board[i][j] = 2;
                    let score = minmax(board, 0, 1);
                    board[i][j] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        bestMoveRow = i;
                        bestMoveCol = j;
                    }
                }
            }
        }
        // console.log("Best row = ", bestMoveRow, "Best col = ", bestMoveCol);
        board[bestMoveRow][bestMoveCol] = 2;
        gameBoard.updateBoard(bestMoveRow, bestMoveCol, 2);
        addAIsymbol(bestMoveRow, bestMoveCol);
        if (gameBoard.checkWinner(board, 2)) {
            gameBoard.postResult("COMPUTER WON THE ROUND");
            game.incrementRounds();
        }
        else game.alternateTurn(); 
        gameBoard.incrementMoves();
        moves++;
        if (moves >= 9) {
            gameBoard.postResult("IT'S A TIE !");
        }
        gameBoard.setBanner();
    }

    function minmax(board, depth, playerIndex) {
        let score = evaluate(board, depth);
        if (score != 0) return score;
        if (!hasEmptyCell(board)) return 0;
        if (playerIndex === 2) {
            let bestVal = -1000;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = 2;
                        bestVal = Math.max(bestVal, minmax(board, depth + 1, 1)); 
                        board[i][j] = "";
                    }
                }
            }
            return bestVal;                
        }
        else {
            let bestVal = 1000;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (!board[i][j]) {
                        board[i][j] = 1;
                        bestVal = Math.min(bestVal, minmax(board, depth + 1, 2)); 
                        board[i][j] = "";
                    }
                }
            }
            return bestVal;                
        }
    }

    function addAIsymbol(row, col) {
        let symbol = game.getPlayer2().symbol;
        let cellCount = 0
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i == row && j === col) {
                    let targetCell = document.getElementById("bc" + cellCount);
                    targetCell.textContent = symbol;
                    targetCell.classList.add("used");
                }
                cellCount++;
            }
        }
    }

    function evaluate(board, depth) {
        if (gameBoard.checkWinner(board, 1)){
            return depth - 10;
        } 
        else if (gameBoard.checkWinner(board, 2)){
            return 10 - depth;
        }
        else return 0;
    }

    function hasEmptyCell(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    return {makeMove};

})();
