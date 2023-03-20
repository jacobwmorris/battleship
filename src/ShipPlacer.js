const Ship = require("./Ship")
const Dom = require("./DomFuncs")

function ShipPlacer() {
    this.placing = false
    this.next = 0
    this.ship = this.shipList[0]
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
    this.setupPlacer()
}

ShipPlacer.prototype.endPlace = function() {
    if (!this.placing)
        return
    
    this.placing = false
    this.destroyPlacer()
}

ShipPlacer.prototype.rotateRight = function() {
    this.ship.direction = Vec.rotateRight(this.ship.direction)
}

ShipPlacer.prototype.rotateLeft = function() {
    this.ship.direction = Vec.rotateLeft(this.ship.direction)
}

/* Helpers */
ShipPlacer.prototype.setupPlacer = function() {
    const root = document.querySelector("body")
    console.log(root)
    const placer = Dom.makeElement("div", "test", "followmouse")

    root.addEventListener("mousemove", this.followMouseCb)
    root.appendChild(placer)
}

ShipPlacer.prototype.destroyPlacer = function() {
    const root = document.querySelector("body")
    const placer = document.querySelector(".followmouse")

    root.removeEventListener("mousemove", this.followMouseCb)
    root.removeChild(placer)
}

ShipPlacer.prototype.followMouseCb = function(event) {
    const follower = document.querySelector(".followmouse")
    const left = event.pageX + "px"
    const top = event.pageY + "px"
    follower.style.left = left
    follower.style.top = top
}

module.exports = ShipPlacer
