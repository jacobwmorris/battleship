const Gamedata = require("./Gamedata")
const Display = require("./Display")
import "./style.css"

const game = new Gamedata()
const display = new Display(document.getElementById("battleship"), 24)
game.setupTEST(1, "p1", "p1", display)
