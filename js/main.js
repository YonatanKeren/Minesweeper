'use strict'

const elBtn = document.querySelector('.btn-restart')
const elTimer = document.querySelector('.timer')
const MINE = '💣'
const MARKED = '🚩'
const PLAYING = '🙂'
const WIN = '😎'
const LOSE = '😵'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    minesRemaining: 999
}

var gLevel = {
    size: 4,
    mines: 2
}

var gBoard

function onInit() {
    resetVars()
    toggleBoard(gGame.isOn)
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    updateMinesRemaining()
}
    
//timer deactivated because its annoying to look at while working
setInterval(timer, 1000)

function buildBoard() {
    const size = gLevel.size
    const board = []
    // var placeableMines = gGame.minesRemaining
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 99,
                isCovered: true,
                isMine: false,
                isMarked: false
            }
            //manually placed mines
            //if (i == 0 && j == 1 || i == 2 && j == 3) cell.isMine = true

            board[i][j] = cell
        }
    }
    randomMinesPlacement(gLevel.mines, gLevel.size, board)
    return board
}

//check every mine and apply the neighbor function
function setMinesNegsCount(board) {
    const rows = board.length
    const cols = board[0].length
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (board[i][j].isMine) continue
            var currCell = board[i][j]
            currCell.i = i
            currCell.j = j
            setMineNegsCount(currCell, rows, cols, board)
        }
    }
}
//actually apply the neighbors function to every mine
function setMineNegsCount(cell, rows, cols, board) {
    const row = cell.i
    const col = cell.j
    var countNegMines = 0
    for (var i = row - 1; i < row + 2; i++) {
        if (i < 0 || i >= cols) continue
        for (var j = col - 1; j < col + 2; j++) {
            if (i == row && j == col) continue
            if (j < 0 || j >= rows) continue
            var currCell = board[i][j]
            if (currCell.isMine) countNegMines++
        }
    }
    cell.minesAroundCount = countNegMines
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})"
                            oncontextmenu="onCellRightClicked(event, ${i}, ${j})">
                            </td>`
        }
        strHTML += '</tr>'
    }
    const elCell = document.querySelector('.board')
    elCell.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (!cell.isCovered || cell.isMarked) return
    cell.isCovered = false
    elCell.classList.add('uncovered')
    if (cell.isMine) {
        elCell.textContent = MINE
        return checkGameOver(cell, gBoard, elCell)
    }
    else {
        if (cell.minesAroundCount === 0) {
            expandReveal(gBoard, elCell, i, j)
        } else {
            elCell.textContent = cell.minesAroundCount.toString()
        }
    }
    return checkGameOver(cell, gBoard)
}

//disabling context menu and applying cell mark afterwards
function onCellRightClicked(event, i, j) {
    event.preventDefault()
    const elCell = document.querySelector(`.cell-${i}-${j}`);
    onCellMarked(elCell, i, j)
}

function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    if (!cell.isCovered) return
    if (!cell.isMarked) {
        elCell.textContent = MARKED
        cell.isMarked = true
        gGame.minesRemaining--
        updateMinesRemaining()
    } else {
        elCell.textContent = ''
        cell.isMarked = false
        gGame.minesRemaining++
        updateMinesRemaining()
    }
}

//check if game is over
function checkGameOver(cell, board, elCell) {
    var nonMines = gLevel.size * gLevel.size - gLevel.mines
    if (cell.isMine) {
        elBtn.textContent = LOSE
        elCell.classList.add('hit')
        showAllMines(board)
    } else {
        if (checkUncoveredCount(board) === nonMines) {
            elBtn.textContent = WIN
            markAllMines(board)
            gGame.minesRemaining = 0
            updateMinesRemaining()
        }
        else return
    }
    gGame.isOn = false
    toggleBoard(gGame.isOn)
}

//disables board until game is reset (when win/lose)
function toggleBoard(bool) {
    const elBoard = document.querySelector('.board')
    if (bool) elBoard.classList.remove('disabled')
    else elBoard.classList.add('disabled')
}

function expandReveal(board, elCell, i, j) {
    elCell.textContent = ''
    const row = i
    const col = j
    for (var i = row - 1; i < row + 2; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = col - 1; j < col + 2; j++) {
            if (i == row && j == col) continue
            if (j < 0 || j >= board[i].length) continue
            const elNeg = document.querySelector(`.cell-${i}-${j}`)
            onCellClicked(elNeg, i, j)
        }
    }
}

//updates top left in the game grid based on marked cells
function updateMinesRemaining() {
    const elMinesRemaining = document.querySelector('.mines-remaining')
    elMinesRemaining.textContent = gGame.minesRemaining
}

//game timer counter
function timer() {
    gGame.secsPassed++
    elTimer.textContent = gGame.secsPassed
}

//checking uncovered cells for win condition
function checkUncoveredCount(board) {
    var uncoveredCount = 0
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (board[i][j].isMine) continue
            if (board[i][j].isCovered) continue
            uncoveredCount++
        }
    }
    return uncoveredCount
}

//used when winning to mark all mines
function markAllMines(board) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const elCell = document.querySelector(`.cell-${i}-${j}`);
            if (board[i][j].isMine) elCell.textContent = MARKED
        }
    }
}

//used when losing to show all mines
function showAllMines(board) {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const elCell = document.querySelector(`.cell-${i}-${j}`);
            if (board[i][j].isMine) {
                elCell.textContent = MINE
                elCell.classList.add('uncovered')
            }
        }
    }
}

//will take gLevel.mines, gLevel.size and gBoard
// need to implement later the use of the first cell and
//to make sure the cell can not have mines around him
function randomMinesPlacement(mines, boardSize, board) {
    var cells = boardSize * boardSize
    var arr = []
    var mineLocs = []
    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            const cellLoc = {
                i: i,
                j: j
            }
            arr.push(cellLoc)
        }
    }
    for (var k = 0; k < mines; k++) {
        var loc = getRandNumExc(0, cells)
        cells--
        mineLocs.push(arr.splice(loc, 1)[0])
    }
    placeMines(mineLocs, board)
    return board
}

//takes the random locations from randomMinesPlacement and
//places them on the board
function placeMines(arr, board) {
    for (var k = 0; k < arr.length; k++) {
        board[arr[k].i][arr[k].j].isMine = true
    }
}

//open/close difficulty selector
function toggleModal() {
    const elModal = document.querySelector('.modal')
    if (elModal.style.display === 'block') elModal.style.display = 'none'
    else {
        elModal.style.display = 'block'
    }
}

//applies difficulty based on user selection
function selectDifficulty(difficulty) {
    if (difficulty === 'beginner') {
        gLevel.mines = 2
        gLevel.size = 4
        onInit()
    } else if (difficulty === 'medium') {
        gLevel.mines = 14
        gLevel.size = 8
        onInit()
    } else if (difficulty === 'expert') {
        gLevel.mines = 32
        gLevel.size = 12
        onInit()

    }
    toggleModal()
}

//resetting some variables on game reset,
//function to decrease clutter in onInit()
function resetVars(){
    elTimer.textContent = '0'
    elBtn.textContent = PLAYING
    gGame.secsPassed = 0
    gGame.isOn = true
    gGame.minesRemaining = gLevel.mines
}

