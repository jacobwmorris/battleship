const Gamedata = require("./Gamedata")
const Display = require("./Display")
const Messages = require("./Messages")
const ShipPlacerCursor = require("./ShipPlacerCursor")
import "./style.css"

const display = new Display(document.getElementById("battleship"), 24)
const cursor = new ShipPlacerCursor()
const messages = new Messages(document.getElementById("messages"))
const game = new Gamedata()

const showNewGameFormCb = function(event) {
    const form = document.getElementById("ng-form")
    if (form.classList.contains("nodisplay")) {
        form.classList.remove("nodisplay")
    }
    else {
        form.classList.add("nodisplay")
    }
}

const startGameCb = function(event) {
    event.preventDefault()
    const mode = document.getElementById("ng-mode").value
    const p1Name = document.getElementById("ng-p1name").value || "Player 1"
    const p2Name = document.getElementById("ng-p2name").value || "Player 2"

    game.setup(mode === "pvc" ? 1 : 2, p1Name, p2Name, display, messages, cursor)
    document.getElementById("ng-form").classList.add("nodisplay")
}

document.getElementById("newgame").addEventListener("click", showNewGameFormCb)
document.getElementById("start").addEventListener("click", startGameCb)
