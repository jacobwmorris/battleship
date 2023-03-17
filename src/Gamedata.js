const Gameboard = require("./Gameboard")
const Player = require("./Player")
const Misc = require("./MiscFuncs")

function Gamedata() {
    this.mode = "pvc"
    this.whosTurn = 1
    this.player1 = new Player("Player 1", 1, false)
    this.player2 = new Player("Player 2 (cpu)", 2, true)
    this.board1 = new Gameboard()
    this.board2 = new Gameboard()
    this.observers = []
    this.messages = null
}

Gamedata.prototype.setup = function(players, p1name, p2name, displayObj, messageObj) {
    this.mode = (players === 1) ? "pvc" : "pvp"
    this.whosTurn = 1
    this.player1.reset(p1name, 1, false)
    this.player2.reset(p2name, 2, (players === 1) ? true : false)
    this.board1.reset()
    this.board2.reset()
    displayObj.setup(this)
    this.observers.push(displayObj)
    this.messages = messageObj
}

Gamedata.prototype.setupTEST = function(players, p1name, p2name, displayObj, messageObj) {
    this.mode = (players === 1) ? "pvc" : "pvp"
    this.whosTurn = 1
    this.player1.reset(p1name, 1, false)
    this.player2.reset(p2name, 2, (players === 1) ? true : false)
    this.board1.reset()
    this.board2.reset()

    this.board1.place("Test ship1", [2, 2], 5, [0, 1])
    this.board2.place("Test ship 2", [3, 5], 3, [1, 0])
    this.board2.hidden = true
    this.board1.receiveAttack([2, 2])
    this.board1.receiveAttack([3, 3])
    this.board2.receiveAttack([5, 5])
    this.board2.receiveAttack([5, 6])

    displayObj.setup(this)
    this.observers.push(displayObj)
    this.messages = messageObj
}

Gamedata.prototype.update = function(info) {
    switch(this.mode) {
        case "pvc":
            this.updatePvC(info)
            break
        case "gameover":
            break
        default:
            break
    }
}

Gamedata.prototype.finishGame = function(winner) {
    const loser = (winner.num === 1) ? this.player2 : this.player1
    this.messages.receiveMessage(`All of ${loser.name}'s ships are sunk. ${this.getRandomConsolation()}`)
    this.messages.receiveMessage(`The winner is ${winner.name}!`, winner.num)
    this.notifyObservers(this)
    this.mode = "gameover"
}

Gamedata.prototype.notifyObservers = function() {
    this.observers.forEach((obs) => obs.update(this))
}

//Create callback for target buttons
Gamedata.prototype.getTargetCallback = function(boardNum) {
    const data = this
    const board = boardNum
    const cb = function(event) {
        if (event.target.classList.contains("used")) { //Don't allow pressing a used button again
            return
        }
        if (board === data.whosTurn) { //The player cannot shoot their own board
            return
        }

        //Player 1 shoots board 2 and vice versa
        const player = (board === 1) ? data.player2 : data.player1
        const pos = [Number.parseInt(event.target.getAttribute("data-x")), Number.parseInt(event.target.getAttribute("data-y"))]
        data.update({player, pos})

        event.target.classList.add("used")
    }

    return cb
}

//Helper functions
Gamedata.prototype.updatePvC = function(info) {
    let success = false
    //player 1 attacks
    success = this.doPlayerAttack(1, info)
    //continue if turn was successful
    if (!success)
        return
    //check for player 1 victory
    if (this.board2.allShipsSunk()) {
        this.finishGame(this.player1)
        return
    }
    //player 2 (cpu) attacks
    this.doCpuAttack()
    //check for player 2 victory
    if (this.board1.allShipsSunk()) {
        this.finishGame(this.player2)
        return
    }
    //redraw board
    this.notifyObservers(this)
}

Gamedata.prototype.doPlayerAttack = function(turn, info) {
    let success = false
    const receivingBoard = (turn === 1) ? this.board2 : this.board1

    if (info.player.num === turn && this.whosTurn === turn) {
        let hit

        try {
            hit = receivingBoard.receiveAttack(info.pos)
        }
        catch(err) {
            this.messages.receiveMessage("Error:" + err.message)
            return success
        }
        this.messages.receiveMessage(
            `${info.player.name} fires on square (${Misc.numToLetter(info.pos[0])}, ${info.pos[1] + 1}).  The shot ${hit ? "hits!" : "misses."}`,
            info.player.num
            )
        success = true
    }

    return success
}

Gamedata.prototype.doCpuAttack = function() {
    let hit
    const cpuMove = this.player2.cpuTurn(this.board1)

    try {
        hit = this.board1.receiveAttack(cpuMove.pos)
    }
    catch(err) {
        this.messages.receiveMessage("Error:" + err.message)
        return
    }

    this.messages.receiveMessage(
        `${cpuMove.player.name} fires on square (${Misc.numToLetter(cpuMove.pos[0])}, ${cpuMove.pos[1] + 1}).  The shot ${hit ? "hits!" : "misses."}`,
        cpuMove.player.num
        )
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

Gamedata.prototype.getRandomConsolation = function() {
    const words = ["Bummer!", "Oh, well!", "Sucks to be them!", "Better luck next time!",
        "Gosh dern it to heck!", "Shoot!", "Too bad!", "Well, ship happens, right?",
        "I guess you could say, their ship has sailed!", "Have fun in Davy Jones's locker!"]
    const rand = Math.floor(Math.random() * words.length)
    return words[rand]
}

module.exports = Gamedata
