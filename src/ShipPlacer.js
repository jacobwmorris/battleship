const Ship = require("./Ship")

function ShipPlacer() {
    this.placing = false
    this.next = 0
    this.ship = this.shipList[0]
    this.observers = []
}

ShipPlacer.prototype.shipList = [
    new Ship("carrier", [0, 0], 5, [1, 0]),
    new Ship("battleship", [0, 0], 4, [1, 0]),
    new Ship("cruiser", [0, 0], 3, [1, 0]),
    new Ship("submarine", [0, 0], 3, [1, 0]),
    new Ship("destroyer", [0, 0], 2, [1, 0])
]

ShipPlacer.prototype.reset = function() {
    this.placing = false
    this.next = 0
    this.ship = this.shipList[0]
}

ShipPlacer.prototype.placeNext = function() {
    if (this.placing)
        return
    
    this.placing = true
    this.ship = this.shipList[this.next]
    this.next += 1
    this.notifyObservers({setup: true})
}

ShipPlacer.prototype.endPlace = function() {
    if (!this.placing)
        return
    
    this.placing = false
    this.notifyObservers({destroy: true})
}

ShipPlacer.prototype.rotateRight = function() {
    this.ship.direction = Vec.rotateRight(this.ship.direction)
}

ShipPlacer.prototype.rotateLeft = function() {
    this.ship.direction = Vec.rotateLeft(this.ship.direction)
}

ShipPlacer.prototype.registerCursor = function(cursor) {
    this.observers.push(cursor)
}

ShipPlacer.prototype.notifyObservers = function(data) {
    this.observers.forEach((o) => o.update(data))
}

module.exports = ShipPlacer
