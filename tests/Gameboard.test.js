const Gameboard = require("Gameboard")

it("Places ships", () => {
    const gb = new Gameboard()
    gb.place("Test ship", [2, 2], 5, [1, 0])
    expect(gb.ships.length).toBe(1)
    expect(gb.ships[0]).toEqual({
        name: "Test ship",
        pos: [2, 2],
        length: 5,
        direction: [1, 0],
        hits: 0
    })
})

it("Won't place ships out of bounds", () => {
    const gb = new Gameboard()
    expect(() => gb.place("Test ship", [-1, 5], 2, [1, 0])).toThrow("Tried to place a ship out of bounds")
    expect(() => gb.place("Test ship", [9, 5], 2, [1, 0])).toThrow("Tried to place a ship out of bounds")
    expect(() => gb.place("Test ship", [5, -1], 2, [0, 1])).toThrow("Tried to place a ship out of bounds")
    expect(() => gb.place("Test ship", [5, 9], 2, [0, 1])).toThrow("Tried to place a ship out of bounds")
})

it("Won't place ships overlaping", () => {
    const gb = new Gameboard()
    gb.place("Ship1", [0, 1], 3, [1, 0])
    expect(() => gb.place("Ship2", [1, 0], 3, [0, 1])).toThrow("Tried to place one ship overlaping another")
    expect(() => gb.place("Ship3", [2, 1], 3, [1, 0])).toThrow("Tried to place one ship overlaping another")
})

it("Receives attacks", () => {
    const gb = new Gameboard()
    gb.place("Ship", [0, 0], 2, [1, 0])
    expect(gb.receiveAttack([5, 5])).toBeFalsy()
    expect(gb.receiveAttack([0, 0])).toBeTruthy()
    expect(gb.shots.length).toBe(2)
})

it("Doesn't accept the same attack twice", () => {
    const gb = new Gameboard()
    gb.receiveAttack([4, 4])
    expect(() => gb.receiveAttack([4, 4])).toThrow("Tried to attack the same square again")
})
