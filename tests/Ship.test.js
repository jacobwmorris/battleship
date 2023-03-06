const Ship = require("Ship")
const Vec = require("Vec")

it("Ship constructor works", () => {
    const shPos = [1, 1]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 5, shDir)
    expect(sh.name).toBe("Test ship")
    expect(Vec.equal(sh.pos, shPos)).toBeTruthy()
    expect(sh.length).toBe(5)
    expect(Vec.equal(sh.direction, shDir)).toBeTruthy()
    expect(sh.hits).toBe(0)
})

it("Takes hits", () => {
    const shPos = [1, 1]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 5, shDir)
    sh.hit()
    expect(sh.hits).toBe(1)
    sh.hit()
    expect(sh.hits).toBe(2)
})

it("Is sunk if the ship has taken too many hits", () => {
    const shPos = [1, 1]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 5, shDir)
    expect(sh.isSunk()).toBeFalsy();
    sh.hit()
    expect(sh.isSunk()).toBeTruthy();
})
