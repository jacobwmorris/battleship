const Gamedata = require("./Gamedata")
const Display = require("./Display")
const Messages = require("./Messages")
import "./style.css"

const game = new Gamedata()
const display = new Display(document.getElementById("battleship"), 24)
const messages = new Messages(document.getElementById("messages"))
game.setupTEST(1, "p1", "p2", display, messages)
