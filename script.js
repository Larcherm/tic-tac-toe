const Player = (name, symbol) => {
    return {
        name, symbol
    };
}

const game = (() => {
    const Gameboard = {
        gameArray: [["X", "X", "X"], ["X", "X", "X"], ["X", "X", "X"]]
    };

    const generate_board = (() => {
        const gameboard_container = document.getElementById("gameboard-container");
        for (let i = 0, l = Gameboard.gameArray.length; i < l; i++) {
            const gameboard_row = document.createElement("div");
            gameboard_row.classList.add("gameboard-row");
            gameboard_container.appendChild(gameboard_row);
            for (let j = 0, l2 = Gameboard.gameArray[i].length; j < l2; j++) {
                const gameboard_cell = document.createElement("div");
                gameboard_cell.classList.add("gameboard-cell");
                gameboard_cell.textContent = Gameboard.gameArray[i][j];
                gameboard_row.appendChild(gameboard_cell);
            }
        }
    })();
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    const gameboard_cells = document.querySelectorAll(".gameboard-cell");
    gameboard_cells.forEach(gameboard_cell => gameboard_cell.addEventListener("click", e => {
        addSymbol();
    }))
    
})();
