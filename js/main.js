'use strict'

const MINE = '💣'
const MARKED = '🚩'

const gGame = {
    score: 0,
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    size: 4,
    mines: 2
}

var gBoard

function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()  
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}

function buildBoard() {
    const size = gLevel.size
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: 99,
                isCovered: true,
                isMine: false,
                isMarked: false
            }
            if (i == 0 && j == 1 || i == 2 && j == 3) cell.isMine = true
            board[i][j] = cell
        }
    }
    console.table(board)
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
    const col = cell.i
    const row = cell.j
    var countNegMines = 0
    for (var i = col - 1; i < col + 2; i++) {
        if (i < 0 || i >= cols) continue
        for (var j = row - 1; j < row + 2; j++) {
            if (i == col && j == row) continue
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
    if (cell.isMine) {
        elCell.textContent = MINE
        return gameOver()
    }
    else{
        elCell.textContent = cell.minesAroundCount.toString()
}
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
    }
    else {
        elCell.textContent = ''
        cell.isMarked = false
    }
}

function gameOver(){
    
}
