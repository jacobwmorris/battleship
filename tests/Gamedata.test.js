const Gamedata = require("Gamedata")

it("Does a player move, followed by a computer move", () => {
    const g = new Gamedata()
    g.update({player: g.player1, pos: [0, 0]})
    expect(g.board1.shots.length).toBe(1)
    expect(g.board2.shots.length).toBe(1)
})
