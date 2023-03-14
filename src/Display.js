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
    const coordinates = this.makeCoordinates(boardData)
    const boardSquares = this.makeBoardSquares(boardData)
    const hitMarks = this.makeHitMarks(boardData)
    //const targetButtons

    board.appendChild(coordinates)
    board.appendChild(boardSquares)
    board.appendChild(hitMarks)
    return board
}

Display.prototype.makeCoordinates = function(boardData) {
    const coordinates = Dom.makeElement("div", "", "coordinates")

    for (let x = 0; x < boardData.width; x++) {
        coordinates.appendChild(this.makeCoordSquare("x", x))
    }
    for (let y = 0; y < boardData.height; y++) {
        coordinates.appendChild(this.makeCoordSquare("y", y))
    }

    return coordinates
}

Display.prototype.makeCoordSquare = function(axis, num) {
    let left = 0, top = 0
    text = (axis === "x") ? this.numToLetter(num) : (num + 1).toString()
    if (axis === "x") {
        left = num * this.squareSize
        top = -this.squareSize
    }
    else {
        left = -this.squareSize
        top = num * this.squareSize
    }
    
    const square = Dom.makeElement("div", text, "coord")
    square.setAttribute("style", `left:${left}px;top:${top}px;`)
    return square
}

Display.prototype.numToLetter = function(num) {
    const A = "A".charCodeAt(0)
    return String.fromCharCode(A + num)
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

Display.prototype.makeHitMarks = function(boardData) {
    const hitMarks = Dom.makeElement("div", "", "hitmarks")

    boardData.shots.forEach((shot) => {
        hitMarks.appendChild(this.makeHitMark(shot.pos[0], shot.pos[1], shot.hit))
    })

    return hitMarks
}

Display.prototype.makeHitMark = function(x, y, hit) {
    const hitMark = Dom.makeElement("div", "", hit ? "markhit" : "markmiss")
    const left = x * this.squareSize
    const top = y * this.squareSize
    hitMark.setAttribute("style", `left:${left}px;top:${top}px;`)

    return hitMark
}

module.exports = Display
