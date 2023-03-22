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
    const sh = new Ship("Test ship", shPos, 2, shDir)
    sh.hit()
    expect(sh.hits).toBe(1)
    sh.hit()
    expect(sh.hits).toBe(2)
})

it("Is sunk if the ship has taken too many hits", () => {
    const shPos = [1, 1]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 1, shDir)
    expect(sh.isSunk()).toBeFalsy();
    sh.hit()
    expect(sh.isSunk()).toBeTruthy();
})

it("getStern returns the opposite end of the ship", () => {
    const shPos = [2, 2]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 3, shDir)
    expect(sh.getStern()).toEqual([4, 2]);
    sh.direction = Vec.rotateRight(sh.direction)
    expect(sh.getStern()).toEqual([2, 4]);
    sh.direction = Vec.rotateRight(sh.direction)
    expect(sh.getStern()).toEqual([0, 2]);
    sh.direction = Vec.rotateRight(sh.direction)
    expect(sh.getStern()).toEqual([2, 0]);
})

it("getSquares returns all squares the ship occupies", () => {
    const shPos = [1, 1]
    const shDir = [1, 0]
    const sh = new Ship("Test ship", shPos, 3, shDir)
    expect(sh.getSquares()).toEqual([[1, 1], [2, 1], [3, 1]]);
})
