const Gameboard = require("./Gameboard")

function Gamedata() {
    this.mode = "pvc"
    this.whosTurn = 1
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
    //attack
    if (info.player === 1 && this.whosTurn === 1) {
        this.board1.receiveAttack(info.pos)
        success = true
    }
    else if (info.player === 2 && this.whosTurn === 2) {
        this.board2.receiveAttack(info.pos)
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
