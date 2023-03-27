const Vec = require("./Vec")
const SmartGuesser = require("./SmartGuesser")

function Player(name, num, isCpu) {
    this.name = name
    this.num = num
    this.isCpu = isCpu
    this.guessGenerator = null
    if (isCpu)
        this.guessGenerator = new SmartGuesser(this.guessRandom)
}

Player.prototype.reset = function(name, num, isCpu) {
    this.name = name
    this.num = num
    this.isCpu = isCpu
    this.guessGenerator = null
    if (isCpu)
        this.guessGenerator = new SmartGuesser(this.guessRandom)
}

Player.prototype.cpuTurn = function(targetBoard) {
    const turn = {player: this}
    if (this.guessGenerator === null) {
        turn.pos = this.guessRandom(targetBoard)
        return turn
    }
    
    // If the smart guesser gets stuck, just unstick it.
    // It will go back to making random guesses
    try {
        turn.pos = this.guessGenerator.guess(targetBoard)
    }
    catch (err) {
        this.guessGenerator.reset()
        turn.pos = this.guessGenerator.guess(targetBoard)
    }
    return turn
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
