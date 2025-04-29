function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(0)
        }
    }
    const getBoard = () => board;

    const putMark = (row, column, player) => {
            // checks if the cell is occupied or not
            let validMove = true;
            if (board[row][column] !== 0) {
                console.log('Space already Occupied. Try again')
                validMove = false;
                return {board, validMove};
            }
            
            board[row][column] = player.mark;
            // printBoard();
            return {validMove, board};
    }

    const resetBoard = () => {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                board[row][col] = 0;
            }
        }
    }

    const printBoard = () => {
        const gridContainer = document.querySelector('.grid-container');
        gridContainer.innerHTML = ''; // Clear old board
        
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                let gridItem = document.createElement('div');
                gridItem.classList.add('grid');
                let gridButton = document.createElement('button');
                gridButton.classList.add('grid-btn');
                gridButton.setAttribute('data-loc', `${row}-${col}`);
                gridItem.appendChild(gridButton);
                gridContainer.appendChild(gridItem)
            }
        }
        console.log(board);
    }

    // Check if the board is full (all cells occupied)
    const isBoardFull = () => {
        for(let row = 0; row < board.length; row++) {
            for(let col = 0; col < board[row].length; col++) {
                if(board[row][col] === 0) {
                    return false; // Found an empty cell, board is not full
                }
            }
        }
        return true; // All cells are occupied
    }

    return {resetBoard, getBoard, printBoard, putMark, isBoardFull};
}

function GameControl(player1, player2) {
    if (player1 === '' && player2 === '') {
        player1 = 'Player One';
        player2 = 'Player Two';
    }
    const players = [
        {
            name: player1,
            mark: 'X'
        },
        {
            name: player2,
            mark: 'O'
        }
    ]
    // console.log(players[0].name, players[1].name);
    

    let activePlayer = players[0];

    const getActivePlayer = () => {return activePlayer};
    
    
    const switchPlayer = (currentPlayer) => {
        let player = currentPlayer === players[0] ? players[1] : players[0];
        return player;
    }

    let gameOver = false;
    const playTurn = (board, row, column) => {
        if (gameOver) return;
        const winnerPlayer = document.getElementById('winner');
        const restartBtn = document.getElementById('restart-btn');
        let playerMove;
        if (activePlayer) {
            playerMove = board.putMark(row, column, activePlayer);
            if(playerMove.validMove === true) {
                let winner = checkWinner(playerMove.board);
                if(winner) {
                    gameOver = true
                    console.log(playerMove.board);
                    winnerPlayer.innerText = `The winner is ${activePlayer.name}!`;
                    console.log(`The winner is ${activePlayer.name}!`);
                    restartBtn.classList.toggle('show-restart');
                    // restartButton();
                    return;
                }
                
                // Check for draw condition
                if(board.isBoardFull()) {
                    gameOver = true;
                    winnerPlayer.innerText = "It's a draw!";
                    console.log("It's a draw!");
                    restartBtn.classList.toggle('show-restart');
                    return;
                }
                
                activePlayer = switchPlayer(activePlayer);
                // Update player turn display
                const playerDisplay = document.querySelector('.player-turn');
                if (playerDisplay) {
                    playerDisplay.innerHTML = `It's ${activePlayer.name}'s turn`;
                }
                console.log(playerMove.board);
            }
        }
        console.log(`It's ${activePlayer.name}'s turn`);
        return activePlayer;
    }

    const checkWinner = (boardState) => {
        if(checkWinningRow(boardState)) {
            return true;
        }

        if(checkWinningCol(boardState)) {
            return true;
        }

        if(diagonalChecks(boardState, activePlayer.mark)) {
            return true;
        }
        return false;
    }

    const getGameOver = () => gameOver;
    const setGameOver = (state) => { gameOver = state; };

    return {getActivePlayer, playTurn, getGameOver, setGameOver};
}

function checkWinningRow(boardState) {
    // Check for winning rows (horizontal lines)
    for(let row = 0; row < boardState.length; row++) {
        // Check if all cells in this row have the same mark (and not empty)
        if(boardState[row][0] !== 0 && 
           boardState[row][0] === boardState[row][1] && 
           boardState[row][1] === boardState[row][2]) {
            return true;
        }
    }
    return false;
}

function checkWinningCol(boardState) {
    // Check for winning columns (vertical lines)
    for(let col = 0; col < boardState[0].length; col++) {
        // Check if all cells in this column have the same mark (and not empty)
        if(boardState[0][col] !== 0 && 
           boardState[0][col] === boardState[1][col] && 
           boardState[1][col] === boardState[2][col]) {
            return true;
        }
    }
    return false;
}

function diagonalChecks(board, mark) {
    // Check for winning diagonals
    // Top-left to bottom-right diagonal
    if(board[0][0] === mark && 
       board[1][1] === mark && 
       board[2][2] === mark) {
        return true;
    }

    // Top-right to bottom-left diagonal
    if(board[0][2] === mark && 
       board[1][1] === mark && 
       board[2][0] === mark) {
        return true;
    }
    
    return false;
}

function DisplayDom() {
    const board = GameBoard();
    let game;
    const startBtn = document.getElementById('start-btn');
    let storedPlayer1;
    let storedPlayer2;

    startBtn.addEventListener('click', () => {
        board.printBoard();
        startButton();
        setupGridButtons();
        restartButton();
    });

    const startButton = () => {
        let player1 = document.getElementById('player1');
        let player2 = document.getElementById('player2');
        storedPlayer1 = player1.value;
        storedPlayer2 = player2.value;
        game = GameControl(storedPlayer1, storedPlayer2);

        let activePlayer = game.getActivePlayer();
        
        const grid = document.querySelector('.players-grid');
        grid.removeChild(document.getElementById('start-btn'));
        const playerDisplay = document.createElement('p');
        playerDisplay.classList.add('player-turn');
        playerDisplay.innerHTML = `It's ${activePlayer.name}'s turn`;
        grid.appendChild(playerDisplay);

        player1.value = '';
        player2.value = '';
    };

    const setupGridButtons = () => {
        const btn = document.querySelectorAll('.grid-btn');
        btn.forEach(cell => {
            // Remove any existing event listeners (important for restart)
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);
            
            newCell.addEventListener('click', () => {
                if (!game || game.getGameOver()) return;
                
                // Don't allow changing cells that already have content
                if (newCell.innerHTML !== '') return;
                
                let cellArray = newCell.dataset.loc.split('-');
                let parseCell = cellArray.map(item => parseInt(item));
                let player = game.getActivePlayer();
                console.log(cellArray);
                console.log(parseCell);
                
                // Only update UI if the move is valid
                const result = game.playTurn(board, parseCell[0], parseCell[1]);
                if (result) {
                    newCell.innerHTML = player.mark;
                }
            });
        });
    };

    const restartButton = () => {
        const restartBtn = document.getElementById('restart-btn');
        
        restartBtn.addEventListener('click', () => {
            board.resetBoard();
            game = GameControl(storedPlayer1, storedPlayer2);

            let player = game.getActivePlayer();
            const playerDisplay = document.querySelector('.player-turn');
            if (playerDisplay) {
                playerDisplay.innerHTML = `It's ${player.name}'s turn`;
            }
            
            restartBtn.classList.toggle('show-restart');
            document.getElementById('winner').innerText = '';
            
            // Reset button texts and re-setup event listeners
            const btn = document.querySelectorAll('.grid-btn');
            btn.forEach(cell => {
                cell.innerHTML = '';
            });
            
            // Important: Re-setup grid buttons to ensure proper event handling
            setupGridButtons();
        });
    }

    return { setupGridButtons, startButton };
}

const game = DisplayDom();