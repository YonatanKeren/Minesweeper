'use strict'

const MINE = '💣'
const FLAG = '🚩'

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
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const size = gLevel.size
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            const cell = {
                minesAroundCount: setMinesNegsCount(),
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

//neighbor mines unfinished
function setMinesNegsCount(){
    return true
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">
                            ${cell}
                        </td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

