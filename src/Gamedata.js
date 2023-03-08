const Gameboard = require("./Gameboard")
const Player = require("./Player")

function Gamedata() {
    this.mode = "pvc"
    this.whosTurn = 1
    this.player1 = new Player("Player 1", 1, false)
    this.player2 = new Player("Player 2 (cpu)", 2, true)
    this.board1 = new Gameboard()
    this.board2 = new Gameboard()
}

Gamedata.prototype.update = function(info) {
    switch(this.mode) {
        case "pvc":
            this.updatePvC(info)
            break
        default:
            break
    }
}

//Helper functions
Gamedata.prototype.updatePvC = function(info) {
    let success = false
    //player 1 attacks
    if (info.player.num === 1 && this.whosTurn === 1) {
        this.board2.receiveAttack(info.pos)
        success = true
    }
    //continue if turn was successful
    if (!success)
        return
    //check for a winner
    //player 2 (cpu) attacks
    const cpuMove = this.player2.cpuTurn(this.board1)
    this.board1.receiveAttack(cpuMove.pos)
    //check for a winner
    //redraw board
}

Gamedata.prototype.updatePvP = function(info) {
    let success = false
    //a player attacks
    if (info.player.num === 1 && this.whosTurn === 1) {
        this.board2.receiveAttack(info.pos)
        success = true
    }
    else if (info.player.num === 2 && this.whosTurn === 2) {
        this.board1.receiveAttack(info.pos)
        success = true
    }
    //continue if turn was successful
    if (!success)
        return
    //check for a winner
    //switch to the next player
    if (this.whosTurn === 1) {
        this.whosTurn = 2
    }
    else if (this.whosTurn === 2) {
        this.whosTurn = 1
    }
    //redraw board
}

module.exports = Gamedata
