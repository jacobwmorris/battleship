const Gameboard = require("./Gameboard")
const Player = require("./Player")
const ShipPlacer = require("./ShipPlacer")
const Misc = require("./MiscFuncs")

function Gamedata() {
    this.mode = "pvc"
    this.resetButtons = false
    this.whosTurn = 1
    this.player1 = new Player("Player 1", 1, false)
    this.player2 = new Player("Player 2 (cpu)", 2, true)
    this.board1 = new Gameboard()
    this.board2 = new Gameboard()
    this.observers = []
    this.messages = null
    this.shipPlacer = new ShipPlacer()
}

Gamedata.prototype.setup = function(players, p1name, p2name, displayObj, messageObj, cursorObj) {
    this.mode = (players === 1) ? "pvc-setup" : "pvp-setup"
    this.whosTurn = 1
    this.player1.reset(p1name, 1, false)
    this.player2.reset(p2name, 2, (players === 1) ? true : false)
    this.board1.reset()
    this.board2.reset()
    this.board1.hidden = false
    this.board2.hidden = true
    displayObj.setup(this)
    this.observers.push(displayObj)
    this.messages = messageObj
    this.messages.clear()
    this.shipPlacer.registerCursor(cursorObj)
    this.beginShipPlacement()
}

Gamedata.prototype.setupTEST = function(players, p1name, p2name, displayObj, messageObj, cursorObj) {
    this.mode = (players === 1) ? "pvc-setup" : "pvp-setup"
    this.whosTurn = 1
    this.player1.reset(p1name, 1, false)
    this.player2.reset(p2name, 2, (players === 1) ? true : false)
    this.board1.reset()
    this.board2.reset()
    displayObj.setup(this)
    this.observers.push(displayObj)
    this.messages = messageObj
    this.messages.clear()
    this.shipPlacer.registerCursor(cursorObj)
    this.beginShipPlacement()
}

Gamedata.prototype.update = function(info) {
    let useButton = false
    switch(this.mode) {
        case "pvc-setup":
            useButton = this.updatePvCSetup(info)
            break
        case "pvc":
            useButton = this.updatePvC(info)
            break
        case "pvp-setup":
            useButton = this.updatePvPSetup(info)
            break
        case "pvp":
            useButton = this.updatePvP(info)
            break
        case "gameover":
            break
        default:
            break
    }

    return useButton
}

Gamedata.prototype.pass = function() {
    switch (this.mode) {
        case "turnover-setup":
            this.passSetup()
            break
        case "pass-setup":
            this.passFinishSetup()
            break
        case "turnover":
            this.passTurn()
            break
        case "pass":
            this.passFinish()
            break
        default:
            break
    }
}

Gamedata.prototype.finishGame = function(winner) {
    const loser = (winner.num === 1) ? this.player2 : this.player1
    this.messages.receiveMessage(`All of ${loser.name}'s ships are sunk. ${this.getRandomConsolation()}`)
    this.messages.receiveMessage(`The winner is ${winner.name}!`, winner.num)
    this.board1.hidden = false
    this.board2.hidden = false
    this.notifyObservers(this)
    this.mode = "gameover"
}

Gamedata.prototype.notifyObservers = function(data) {
    this.observers.forEach((o) => o.update(data))
}

//Create callbacks for game buttons
Gamedata.prototype.getTargetCallback = function(boardNum) {
    const data = this
    const cb = function(event) {
        if (event.target.classList.contains("used")) { //Don't allow pressing a used button again
            return
        }

        const pos = [Number.parseInt(event.target.getAttribute("data-x")), Number.parseInt(event.target.getAttribute("data-y"))]
        const useButton = data.update({boardNum, pos})

        if (useButton)
            event.target.classList.add("used")
    }

    return cb
}

Gamedata.prototype.getPassCallback = function() {
    const data = this
    const cb = function(event) {
        data.pass()
    }
    return cb
}

//Helper functions
//For single player
Gamedata.prototype.updatePvCSetup = function(info) {
    //Each player places on their own board
    const player = (info.boardNum === 1) ? this.player1 : this.player2
    let success = false
    //Place ship for the current player, using the info
    success = this.doPlayerPlace(player, info.pos)
    //Only continue if the ship was actually placed
    if (!success)
        return false
    //Start the next place
    this.shipPlacer.endPlace()
    //if shipPlacer.next > 5: if whosTurn = 1: place cpu ships, then done
    if (this.shipPlacer.next >= 5 && this.whosTurn === 1) {
        this.doCpuPlace()
        this.messages.receiveMessage("Setup is complete.  Let the game begin!")
        this.mode = "pvc"
        this.notifyObservers(this)
        return false
    }
    //Get the next ship to place
    this.shipPlacer.placeNext()
    this.messages.receiveMessage(`${player.name}, place your ${this.shipPlacer.ship.name}.`, player.num)
    //Redraw boards
    this.notifyObservers(this)
    return false
}

Gamedata.prototype.doPlayerPlace = function(player, pos) {
    let success = false
    const receivingBoard = (player.num === 1) ? this.board1 : this.board2

    if (player.num === this.whosTurn) {
        const ship = this.shipPlacer.ship

        try {
            receivingBoard.place(ship.name, pos, ship.length, ship.direction)
        }
        catch (err) {
            this.messages.receiveMessage("Error: " + err.message)
            return success
        }
        success = true
    }

    return success
}

Gamedata.prototype.doCpuPlace = function() {
    let success = true
    success = success && this.board2.placeRandom("carrier", 5, 50)
    success = success && this.board2.placeRandom("battleship", 4, 50)
    success = success && this.board2.placeRandom("cruiser", 3, 50)
    success = success && this.board2.placeRandom("submarine", 3, 50)
    success = success && this.board2.placeRandom("destroyer", 2, 50)

    if (success) {
        this.messages.receiveMessage(`${this.player2.name} has placed their ships.`, this.player2.num)
    }
    else {
        this.messages.receiveMessage(`Note: ${this.player2.name} was unable to place all of their ships.`)
    }
}

Gamedata.prototype.updatePvC = function(info) {
    //Player 1 shoots board 2 and vice versa
    const player = (info.boardNum === 1) ? this.player2 : this.player1
    let success = false
    //player 1 attacks
    success = this.doPlayerAttack(1, player, info.pos)
    //continue if turn was successful
    if (!success)
        return success
    
    //check for player 1 victory
    if (this.board2.allShipsSunk()) {
        this.finishGame(this.player1)
        return success
    }
    //player 2 (cpu) attacks
    this.doCpuAttack()
    //check for player 2 victory
    if (this.board1.allShipsSunk()) {
        this.finishGame(this.player2)
        return success
    }
    //redraw board
    this.notifyObservers(this)
    return success
}

Gamedata.prototype.doPlayerAttack = function(turn, player, pos) {
    let success = false
    const receivingBoard = (turn === 1) ? this.board2 : this.board1

    if (player.num === turn && this.whosTurn === turn) {
        let result

        try {
            result = receivingBoard.receiveAttack(pos)
        }
        catch(err) {
            this.messages.receiveMessage("Error:" + err.message)
            return success
        }
        this.messages.receiveMessage(
            `${player.name} fires on square (${Misc.numToLetter(pos[0])}, ${pos[1] + 1}).  The shot ${result.hit ? "hits!" : "misses."}`,
            player.num
            )
        if (result.sunk) {
            this.messages.receiveMessage(`The opponent's ${result.hitShip.name} is sunk!`, player.num)
        }
        success = true
    }

    return success
}

Gamedata.prototype.doCpuAttack = function() {
    let result
    const cpuMove = this.player2.cpuTurn(this.board1)

    try {
        result = this.board1.receiveAttack(cpuMove.pos)
    }
    catch(err) {
        this.messages.receiveMessage("Error:" + err.message)
        return
    }

    this.messages.receiveMessage(
        `${cpuMove.player.name} fires on square (${Misc.numToLetter(cpuMove.pos[0])}, ${cpuMove.pos[1] + 1}).  The shot ${result.hit ? "hits!" : "misses."}`,
        cpuMove.player.num
        )
    if (result.sunk) {
        this.messages.receiveMessage(`The opponent's ${result.hitShip.name} is sunk!`, cpuMove.player.num)
    }
}

//For two player
Gamedata.prototype.updatePvP = function(info) {
    let success = false
    //Player 1 shoots board 2 and vice versa
    const player = (info.boardNum === 1) ? this.player2 : this.player1
    const receivingBoard = (info.boardNum === 1) ? this.board1 : this.board2
    //a player attacks
    if (player.num === this.whosTurn) {
        success = this.doPlayerAttack(this.whosTurn, player, info.pos)
    }

    if (!success)
        return
    //check for a winner
    if (receivingBoard.allShipsSunk()) {
        this.finishGame(player)
        return success
    }
    //switch to the next player
    this.endTurn()
    this.notifyObservers(this)
    return success
}

Gamedata.prototype.endTurn = function() {
    const nextPlayer = (this.whosTurn === 1) ? this.player2 : this.player1
    this.messages.receiveMessage(`Pass to ${nextPlayer.name}`, this.whosTurn)
    this.mode = "turnover"
}

Gamedata.prototype.passTurn = function() {
    this.board1.hidden = true
    this.board2.hidden = true
    if (this.whosTurn === 1) {
        this.whosTurn = 2
    }
    else {
        this.whosTurn = 1
    }
    this.mode = "pass"
    this.notifyObservers(this)
}

Gamedata.prototype.passFinish = function() {
    if (this.whosTurn === 1) {
        this.board1.hidden = false
        this.board2.hidden = true
    }
    else {
        this.board1.hidden = true
        this.board2.hidden = false
    }

    this.mode = "pvp"
    this.notifyObservers(this)
}

Gamedata.prototype.updatePvPSetup = function(info) {
    //Each player places on their own board
    const player = (info.boardNum === 1) ? this.player1 : this.player2
    let success = false
    //Place ship for the current player, using the info
    success = this.doPlayerPlace(player, info.pos)
    //Only continue if the ship was actually placed
    if (!success)
        return false
    //Start the next place
    this.shipPlacer.endPlace()
    //if shipPlacer.next > 5: end current player's setup turn
    if (this.shipPlacer.next >= 5) {
        this.endSetupTurn()
        this.notifyObservers(this)
        return
    }
    //Get the next ship to place
    this.shipPlacer.placeNext()
    this.messages.receiveMessage(`${player.name}, place your ${this.shipPlacer.ship.name}.`, player.num)
    //Redraw boards
    this.notifyObservers(this)
    return false
}

Gamedata.prototype.endSetupTurn = function() {
    const nextPlayer = (this.whosTurn === 1) ? this.player2 : this.player1
    this.messages.receiveMessage(`Your ships are placed, pass to ${nextPlayer.name}`, this.whosTurn)
    this.shipPlacer.reset()
    this.mode = "turnover-setup"
}

Gamedata.prototype.passSetup = function() {
    this.board1.hidden = true
    this.board2.hidden = true
    if (this.whosTurn === 1) {
        this.whosTurn = 2
    }
    else {
        this.whosTurn = 1
    }
    this.mode = "pass-setup"
    this.notifyObservers(this)
}

Gamedata.prototype.passFinishSetup = function() {
    if (this.whosTurn === 1) {
        this.board1.hidden = false
        this.board2.hidden = true
    }
    else {
        this.board1.hidden = true
        this.board2.hidden = false
    }
    //Move to main game if all ships have been placed
    if (this.board1.ships.length >= 5 && this.board2.ships.length >= 5) {
        this.mode = "pvp"
        this.messages.receiveMessage("Setup is complete.  Let the game begin!")
        this.notifyObservers(this)
        return
    }

    this.mode = "pvp-setup"
    this.shipPlacer.placeNext()
    this.notifyObservers(this)
}

//Other functions
Gamedata.prototype.getRandomConsolation = function() {
    const words = ["Bummer!", "Oh, well!", "Sucks to be them!", "Better luck next time!",
        "Gosh dern it to heck!", "Shoot!", "Too bad!", "Well, ship happens, right?",
        "I guess you could say, their ship has sailed!", "Have fun in Davy Jones's locker!"]
    const rand = Math.floor(Math.random() * words.length)
    return words[rand]
}

Gamedata.prototype.beginShipPlacement = function() {
    this.whosTurn = 1
    this.shipPlacer.reset()
    this.shipPlacer.placeNext()
    this.messages.receiveMessage(`${this.player1.name}, place your ${this.shipPlacer.ship.name}.`, this.whosTurn)
}

module.exports = Gamedata
