
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

module.exports = Ship
