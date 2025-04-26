// Initialize and Display the board - DONE
// Initialize the players - DONE
// inser player marks in the board
// check for available spaces in the board
// switch between players
// check for the winner

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

    const printBoard = () => {
        console.log(board);
    }


    return {getBoard, printBoard, putMark};
}

function GameControl(player1 = 'Player One', player2 = 'Player Two') {
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
    let board = GameBoard();
    board.printBoard();
    let activePlayer = players[0];

    const switchPlayer = (currentPlayer) => {
        let player = currentPlayer === players[0] ? players[1] : players[0];
        return player;
    }

    console.log(`It's ${activePlayer.name}'s turn`);
    const playTurn = (row, column) => {
        let playerMove;
        if (activePlayer) {
            playerMove = board.putMark(row, column, activePlayer);
            if(playerMove.validMove === true) {
                let winner = checkWinner(playerMove.board);
                if(winner) {
                    console.log(playerMove.board);
                    console.log(`The winner is ${activePlayer.name}`);
                    return;
                }
                activePlayer = switchPlayer(activePlayer);
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

    return {playTurn};
}

function checkWinningRow(boardState) {
    let winner = WinConditions();
    for(let row = 0; row < boardState.length; row++) {
        for(let column = 0; column < boardState[row].length; column++) {
            if(winner.conditions(boardState, row, column)) return true;
        }
        winner.winningMarks.winningRowCircle = 0;
        winner.winningMarks.winningRowX = 0;
        
    }
    
    return false;
}

function checkWinningCol(boardState) {
    let winner = WinConditions();
    for(let column = 0; column < boardState.length; column++) {
        for(let row = 0; row < boardState[column].length; row++) {
            if(winner.conditions(boardState, row, column)) return true;
        }
        winner.winningMarks.winningRowCircle = 0;
        winner.winningMarks.winningRowX = 0;
    }
    
    return false;
}

function WinConditions() {
    let winningMarks = {
        winningRowCircle: 0,
        winningRowX: 0,
    }

    const conditions = (board, row, col) => {
        if(board[row][col] === 0) {
            winningMarks.winningRowCircle = 0;
            winningMarks.winningRowX = 0;
        }
        if (board[row][col] === 'O') {
           winningMarks.winningRowX = 0;
            winningMarks.winningRowCircle++;
        }
        if(board[row][col] === 'X') {
            winningMarks.winningRowCircle = 0;
            winningMarks.winningRowX++;
        }
        
        if(winningMarks.winningRowX === 3 || winningMarks.winningRowCircle === 3) {
            return true;
        }
        return false;
    }

    
    return {winningMarks, conditions};
}

function diagonalChecks(board, mark) {
        if(board[0][0] === mark) {
            if(board[1][1] === mark) {
                if(board[2][2] === mark) {
                    return true;
                }
            }
        }

        if(board[0][2] === mark) {
            if(board[1][1] === mark) {
                if(board[2][0] === mark) {
                    return true;
                }
            }
        }
        return false;
}




const test = GameControl('Luck', 'Shy');
test.playTurn(1, 1);
test.playTurn(0, 0);
test.playTurn(2, 2);
test.playTurn(0, 2);
test.playTurn(2, 1);
test.playTurn(1, 0);
test.playTurn(0, 1);
test.playTurn(1, 2);



