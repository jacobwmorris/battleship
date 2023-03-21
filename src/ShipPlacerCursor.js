const Dom = require("./DomFuncs")

function ShipPlacerCursor() {
    this.cursor = null
}

ShipPlacerCursor.prototype.setupPlacer = function() { 
    const root = document.querySelector("body")
    this.cursor = Dom.makeElement("div", "test", "followmouse")

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
    this.cursor.textContent = "L:" + data.length + ",R:" + data.direction
}

ShipPlacerCursor.prototype.followMouseCb = function(event) {
    const follower = document.querySelector(".followmouse")
    const left = event.pageX + "px"
    const top = event.pageY + "px"
    follower.style.left = left
    follower.style.top = top
}

ShipPlacerCursor.prototype.setupRotationCb = function(placerObj) {
    const cb = function(event) {
        if (event.code === "KeyR" && placerObj.placing) {
            placerObj.rotateRight()
        }
    }

    window.addEventListener("keydown", cb)
}

module.exports = ShipPlacerCursor
