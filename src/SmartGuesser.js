const Vec = require("./Vec")

function SmartGuesser(randomGuesser) {
    this.mode = "rand"
    this.randomGuesser = randomGuesser
    this.hit = [0, 0]
    this.direction = [1, 0]
    this.distance = 2
}

SmartGuesser.prototype.guess = function(board) {
    switch (this.mode) {
        case "rand":
            return this.rand(board, 0)
        case "surround":
            return this.surround(board, 0)
        case "trace":
            return this.trace(board, 0)
        default:
            return [0, 0]
    }
}

SmartGuesser.prototype.reset = function() {
    this.mode = "rand"
    this.hit = [0, 0]
    this.direction = [1, 0]
    this.distance = 2
}

SmartGuesser.prototype.rand = function(board, rDepth) {
    if (rDepth > 5) throw new Error("Failed to find a random square")

    const pos = this.randomGuesser(board)
    const result = board.dryFire(pos)
    if (!result.legal) {
        return this.rand(board, rDepth + 1)
    }
    if (result.hit) {
        this.randFoundShip(pos)
    }
    return pos
}

SmartGuesser.prototype.randFoundShip = function(pos) {
    this.hit = pos
    this.direction = [1, 0]
    this.mode = "surround"
}

SmartGuesser.prototype.surround = function(board, rDepth) {
    if (rDepth >= 4) throw new Error("No legal squares surrounding hit position")

    const pos = Vec.add(this.hit, this.direction)
    const result = board.dryFire(pos)
    if (!result.legal) {
        this.direction = Vec.rotateRight(this.direction)
        return this.surround(board, rDepth + 1)
    }
    if (result.hit) {
        if (result.sunk) {
            this.sunkShip()
        }
        else {
            this.surroundFoundDirection()
        }
    }
    else {
        this.direction = Vec.rotateRight(this.direction)
    }
    return pos
}

SmartGuesser.prototype.sunkShip = function() {
    this.mode = "rand"
}

SmartGuesser.prototype.surroundFoundDirection = function() {
    this.distance = 2
    this.mode = "trace"
}

SmartGuesser.prototype.trace = function(board, rDepth) {
    if (rDepth >= 2) throw new Error("No legal squares on either side while tracing a ship")

    const pos = Vec.add(this.hit, Vec.multiply(this.direction, this.distance))
    const result = board.dryFire(pos)
    if (!result.legal) {
        this.direction = Vec.multiply(this.direction, -1)
        this.distance = 1
        return this.trace(board, rDepth + 1)
    }
    if (result.hit) {
        if (result.sunk) {
            this.sunkShip()
        }
        else {
            this.distance += 1
        }
    }
    else {
        this.direction = Vec.multiply(this.direction, -1)
        this.distance = 1
    }
    return pos
}

module.exports = SmartGuesser
