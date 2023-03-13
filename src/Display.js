const Dom = require("./DomFuncs")
const Vec = require("./Vec")

function Display(element, squareSize) {
    this.element = element
    this.squareSize = squareSize
}

Display.prototype.setup = function(data) {
    Dom.clearChildren(this.element)
    this.element.appendChild(this.makeBoardWrapper(data.player1, data.board1))
    this.element.appendChild(this.makeBoardWrapper(data.player2, data.board2))
}

Display.prototype.update = function(data) {
    console.log("Observer updated")
}

Display.prototype.makeBoardWrapper = function(pData, boardData) {
    const bWrapper = Dom.makeElement("div", "", ["boardwrapper", (pData.num === 1) ? "p1" : "p2"])
    const pName = this.makePlayerName(pData)
    const board = this.makeGameboard(boardData)

    bWrapper.appendChild(pName)
    bWrapper.appendChild(board)
    return bWrapper
}

Display.prototype.makePlayerName = function(pData) {
    const pName = Dom.makeElement("h2", pData.name, "playername")
    pName.classList.add((pData.num === 1) ? "redtext" : "bluetext")
    return pName
}

Display.prototype.makeGameboard = function(boardData) {
    const board = Dom.makeElement("div", "", "gameboard")
    //"coordinates", "boardsquares", "hitmarks", "targetbuttons"
    //const coordinates
    const boardSquares = this.makeBoardSquares(boardData)
    //const hitMarks
    //const targetButtons

    board.appendChild(boardSquares)
    return board
}

Display.prototype.makeBoardSquares = function(boardData) {
    const grid = Dom.makeElement("div", "", "boardsquares")
    const shipSquares = boardData.getShipSquares()

    for (let y = 0; y < boardData.height; y++) {
        for (let x = 0; x < boardData.width; x++) {
            grid.appendChild(this.makeBoardSquare(x, y, boardData.hidden, shipSquares))
        }
    }

    return grid
}

Display.prototype.makeBoardSquare = function(x, y, hidden, shipSquares) {
    const left = x * this.squareSize
    const top = y * this.squareSize
    const s = Dom.makeElement("div", "", "")
    s.setAttribute("style", `left:${left}px;top:${top}px;`)

    if (hidden) { //If it's hidden, always return a dark water square
        s.classList.add("watersquare-dark")
        return s
    }
    
    let isShip = false //If not, return a water or a ship square
    if (shipSquares.find((ssq) => Vec.equal(ssq, [x, y])) !== undefined) {
        isShip = true
    }

    s.classList.add(isShip ? "shipsquare" : "watersquare")
    return s
}

module.exports = Display
