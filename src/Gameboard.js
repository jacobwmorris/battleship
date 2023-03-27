const Ship = require("./Ship")
const Vec = require("./Vec")

function Gameboard() {
    this.hidden = false
    this.ships = []
    this.shots = []
}

Gameboard.prototype.width = 10
Gameboard.prototype.height = 10

Gameboard.prototype.reset = function() {
    this.ships.splice(0, this.ships.length)
    this.shots.splice(0, this.shots.length)
}

Gameboard.prototype.place = function(name, pos, length, direction) {
    const sh = new Ship(name, pos, length, direction)

    if (!this.shipInBounds(sh)) {
        throw new Error("Tried to place a ship out of bounds")
    }

    this.ships.forEach((s) => {
        if (this.shipsOverlap(s, sh)) {
            throw new Error("Tried to place one ship overlaping another")
        }
    })

    this.ships.push(sh)
}

Gameboard.prototype.placeRandom = function(name, length, maxAttempts, randFunc) {
    randFunc = !randFunc ? this.getRandShipPosition : randFunc
    let randPos = randFunc()
    let success = false

    for (let a = 0; a < maxAttempts; a++) {
        try {
            this.place(name, randPos.pos, length, randPos.direction)
        }
        catch (err) {
            randPos = randFunc()
            continue
        }
        success = true
        break
    }

    return success
}

// Return object: hit is true if the shot hit,
// hitShip is the ship that was hit (null if no ship was hit),
// sunk is if the hit ship was sunk
Gameboard.prototype.receiveAttack = function(pos) {
    if (this.shots.find((shot) => Vec.equal(shot.pos, pos))) {
        throw new Error("Tried to attack the same square again")
    }

    let result = {hit: false, hitShip: null, sunk: false}
    this.ships.forEach((s) => {
        if (this.shotHits(pos, s)) {
            s.hit()
            result.hit = true
            result.hitShip = s
            result.sunk = s.isSunk()
        }
    })
    this.shots.push({pos: pos, hit: result.hit})
    return result
}

Gameboard.prototype.allShipsSunk = function() {
    if (this.ships.find((ship) => !ship.isSunk())) {
        return false
    }
    return true
}

Gameboard.prototype.getShipSquares = function() {
    const sq = []
    this.ships.forEach((s) => sq.push(s.getSquares()))
    return sq.flat(1)
}

//Helper functions
Gameboard.prototype.shipInBounds = function(ship) {
    const bow = ship.pos
    const stern = ship.getStern()
    return Vec.inBounds(bow, [0, 0], [this.width, this.height]) && Vec.inBounds(stern, [0, 0], [this.width, this.height])
}

Gameboard.prototype.shipsOverlap = function(sh1, sh2) {
    let sh1Min = sh1.pos
    let sh1Max = sh1.getStern()
    let sh2Min = sh2.pos
    let sh2Max = sh2.getStern()

    //The stern of a ship isn't necessarily its "min" position.  Swap the values if it isn't
    if (sh1Min[0] > sh1Max[0] || sh1Min[1] > sh1Max[1]) {
        const swap = sh1Min
        sh1Min = sh1Max
        sh1Max = swap
    }
    if (sh2Min[0] > sh2Max[0] || sh2Min[1] > sh2Max[1]) {
        const swap = sh2Min
        sh2Min = sh2Max
        sh2Max = swap
    }
    
    return sh1Max[0] >= sh2Min[0] && sh1Min[0] <= sh2Max[0] &&
        sh1Max[1] >= sh2Min[1] && sh1Min[1] <= sh2Max[1]
}

Gameboard.prototype.shotHits = function(pos, ship) {
    const squares = ship.getSquares()
    if (squares.find((sq) => Vec.equal(sq, pos))) {
        return true
    }
    return false
}

Gameboard.prototype.getRandShipPosition = function() {
    const randX = Math.floor(Math.random() * 10)
    const randY = Math.floor(Math.random() * 10)
    const randDir = [[1, 0], [0, 1], [-1, 0], [0, -1]][Math.floor(Math.random() * 4)]
    return {pos: [randX, randY], direction: randDir}
}

module.exports = Gameboard
