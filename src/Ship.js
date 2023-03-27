const Vec = require("./Vec")

function Ship(name, pos, length, direction) {
    this.name = name
    this.pos = pos
    this.length = length
    this.direction = direction
    this.hits = 0;
}

Ship.prototype.hit = function() {
    this.hits++
}

Ship.prototype.isSunk = function() {
    return this.hits >= this.length;
}

// Returns true if the ship would be sunk if hit again
Ship.prototype.wouldBeSunk = function() {
    return (this.hits + 1) >= this.length
}

Ship.prototype.getStern = function() {
    const scaleLength = (this.length <= 0) ? 0 : this.length - 1
    return Vec.add(this.pos, Vec.multiply(this.direction, scaleLength))
}

Ship.prototype.getSquares = function() {
    let sq = this.pos
    const squares = []

    for (let n = 0; n < this.length; n++) {
        squares.push(sq)
        sq = Vec.add(sq, this.direction)
    }

    return squares
}

module.exports = Ship
