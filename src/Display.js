const Dom = require("./DomFuncs")
const Vec = require("./Vec")
const Misc = require("./MiscFuncs")

function Display(element, squareSize) {
    this.element = element
    this.squareSize = squareSize
}

Display.prototype.setup = function(data) {
    Dom.clearChildren(this.element)
    const p1 = this.makeBoardWrapper(data.player1, data.board1, data.getTargetCallback(1))
    const p2 = this.makeBoardWrapper(data.player2, data.board2, data.getTargetCallback(2))
    this.element.appendChild(p1)
    this.element.appendChild(p2)

    this.setTargetsEnabled(data)
}

Display.prototype.update = function(data) {
    const boardSquares1 = this.element.querySelector(".p1 .boardsquares")
    const boardSquares2 = this.element.querySelector(".p2 .boardsquares")
    const hitMarks1 = this.element.querySelector(".p1 .hitmarks")
    const hitMarks2 = this.element.querySelector(".p2 .hitmarks")

    boardSquares1.parentElement.replaceChild(this.makeBoardSquares(data.board1), boardSquares1)
    boardSquares2.parentElement.replaceChild(this.makeBoardSquares(data.board2), boardSquares2)
    hitMarks1.parentElement.replaceChild(this.makeHitMarks(data.board1), hitMarks1)
    hitMarks2.parentElement.replaceChild(this.makeHitMarks(data.board2), hitMarks2)

    this.setTargetsEnabled(data)
}

Display.prototype.makeBoardWrapper = function(pData, boardData, boardCb) {
    const bWrapper = Dom.makeElement("div", "", ["boardwrapper", (pData.num === 1) ? "p1" : "p2"])
    const pName = this.makePlayerName(pData)
    const board = this.makeGameboard(boardData, boardCb)

    bWrapper.appendChild(pName)
    bWrapper.appendChild(board)
    return bWrapper
}

Display.prototype.makePlayerName = function(pData) {
    const pName = Dom.makeElement("h2", pData.name, "playername")
    pName.classList.add((pData.num === 1) ? "redtext" : "bluetext")
    return pName
}

Display.prototype.makeGameboard = function(boardData, boardCb) {
    const board = Dom.makeElement("div", "", "gameboard")
    const coordinates = this.makeCoordinates(boardData)
    const boardSquares = this.makeBoardSquares(boardData)
    const hitMarks = this.makeHitMarks(boardData)
    const targetButtons = this.makeTargetButtons(boardData, boardCb)

    board.appendChild(coordinates)
    board.appendChild(boardSquares)
    board.appendChild(hitMarks)
    board.appendChild(targetButtons)
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
    text = (axis === "x") ? Misc.numToLetter(num) : (num + 1).toString()
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

Display.prototype.makeTargetButtons = function(boardData, boardCb) {
    const buttons = Dom.makeElement("div", "", "targetbuttons")

    for (let y = 0; y < boardData.height; y++) {
        for (let x = 0; x < boardData.width; x++) {
            buttons.appendChild(this.makeTargetButton(x, y, boardCb))
        }
    }

    return buttons
}

Display.prototype.makeTargetButton = function(x, y, boardCb) {
    const left = x * this.squareSize
    const top = y * this.squareSize
    const button = Dom.makeElement("button", "", "target")
    button.setAttribute("style", `left:${left}px;top:${top}px;`)
    button.setAttribute("data-x", x)
    button.setAttribute("data-y", y)
    button.addEventListener("click", boardCb)

    return button
}

Display.prototype.setTargetsEnabled = function(gameData) {
    const p1 = this.element.querySelector(".p1")
    const p2 = this.element.querySelector(".p2")

    if (gameData.whosTurn === 1) {
        p1.classList.remove("enabletargets")
        p2.classList.add("enabletargets")
    }
    else {
        p1.classList.add("enabletargets")
        p2.classList.remove("enabletargets")
    }
}

module.exports = Display
