const Gamedata = require("Gamedata")

it("Sends attacks to the game boards", () => {
    const g = new Gamedata()
    g.update({player: 1, pos: [0, 0]})
    expect(g.board1.shots.length).toBe(1)
})

it("Switches players when they take their turn", () => {
    const g = new Gamedata()
    const p1Turn = {player: 1, pos: [0, 0]}
    const p2Turn = {player: 2, pos: [0, 0]}
    g.update(p1Turn)
    expect(g.whosTurn).toBe(2)
    g.update(p1Turn)
    expect(g.whosTurn).toBe(2)
    g.update(p2Turn)
    expect(g.whosTurn).toBe(1)
})
