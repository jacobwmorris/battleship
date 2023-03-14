const Vec = require("./Vec")

function Player(name, num, isCpu) {
    this.name = name
    this.num = num
    this.isCpu = isCpu
}

Player.prototype.reset = function(name, num, isCpu) {
    this.name = name
    this.num = num
    this.isCpu = isCpu
}

Player.prototype.cpuTurn = function(targetBoard) {
    return {player: this, pos: this.guessRandom(targetBoard)}
}

//Helpers
Player.prototype.guessRandom = function(board) {
    const unguessed = []
    for (let y = 0; y < board.height; y++) {
        for (let x = 0; x < board.width; x++) {
            const pos = [x, y]
            
            if (board.shots.find((s) => Vec.equal(s.pos, pos)) === undefined) {
                unguessed.push(pos)
            }
        }
    }

    return unguessed[Math.floor(Math.random() * unguessed.length)]
}

module.exports = Player
