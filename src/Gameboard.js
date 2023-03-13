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

Gameboard.prototype.receiveAttack = function(pos) {
    if (this.shots.find((shot) => Vec.equal(shot.pos, pos))) {
        throw new Error("Tried to attack the same square again")
    }

    let hit = false
    this.ships.forEach((s) => {
        if (this.shotHits(pos, s)) {
            s.hit()
            hit = true
        }
    })
    this.shots.push({pos: pos, hit: hit})
    return hit
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
    const sh1Min = sh1.pos
    const sh1Max = sh1.getStern()
    const sh2Min = sh2.pos
    const sh2Max = sh2.getStern()
    return sh1Max[0] >= sh2Min[0] && sh1Min[0] <= sh2Max[0] && sh1Max[1] >= sh2Min[1] && sh1Min[1] <= sh2Max[1]
}

Gameboard.prototype.shotHits = function(pos, ship) {
    const squares = ship.getSquares()
    if (squares.find((sq) => Vec.equal(sq, pos))) {
        return true
    }
    return false
}

module.exports = Gameboard
