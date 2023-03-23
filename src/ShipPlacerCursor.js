const Dom = require("./DomFuncs")
const Vec = require("./Vec")

function ShipPlacerCursor(squareSize) {
    this.cursor = null
    this.squareSize = squareSize
    this.rotationIsSetup = false
}

ShipPlacerCursor.prototype.directionClasses = {
    "r": "",
    "d": "rot90",
    "l": "rot180",
    "u": "rot270"
}

ShipPlacerCursor.prototype.setupPlacer = function() { 
    const root = document.querySelector("body")
    this.cursor = Dom.makeElement("div", "", "followmouse")

    root.addEventListener("mousemove", this.followMouseCb)
    root.appendChild(this.cursor)
}

ShipPlacerCursor.prototype.destroyPlacer = function() {
    if (this.cursor === null) {
        return
    }

    const root = document.querySelector("body")
    root.removeEventListener("mousemove", this.followMouseCb)
    root.removeChild(this.cursor)
    this.cursor = null
}

//Data needed: setup?, destroy?, length, direction
ShipPlacerCursor.prototype.update = function(data) {
    if (data.setup) {
        this.setupPlacer()
    }
    if (data.destroy) {
        this.destroyPlacer()
        return
    }

    Dom.clearChildren(this.cursor)
    const ship = Dom.makeElement("div", "", ["ship-placer", this.directionClasses[Vec.getDirection(data.direction)]])
    const tOrigin = (this.squareSize / 2) + "px"
    ship.setAttribute("style", `height:${this.squareSize}px;width:${this.squareSize * data.length}px;transform-origin:${tOrigin} ${tOrigin};`)
    this.cursor.appendChild(ship)
    //this.cursor.textContent = "L:" + data.length + ",R:" + data.direction
}

ShipPlacerCursor.prototype.followMouseCb = function(event) {
    const follower = document.querySelector(".followmouse")
    const left = event.pageX + "px"
    const top = event.pageY + "px"
    follower.style.left = left
    follower.style.top = top
}

ShipPlacerCursor.prototype.setupRotationCb = function(placerObj) {
    if (this.rotationIsSetup)
        return
    
    const cb = function(event) {
        if (event.code === "KeyR" && placerObj.placing) {
            placerObj.rotateRight()
        }
    }

    window.addEventListener("keydown", cb)
    this.rotationIsSetup = true
}

module.exports = ShipPlacerCursor
