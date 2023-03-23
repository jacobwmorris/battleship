const Vec = require("Vec")

it("Checks if two vectors are equal", () => {
    const a = [1, 2]
    const b = [1, 2]
    const c = [0, 2]
    expect(Vec.equal(a, b)).toBeTruthy()
    expect(Vec.equal(a, c)).toBeFalsy()
})

it("Adds two vectors", () => {
    const a = [1, 2]
    const b = [2, 1]
    expect(Vec.add(a, b)).toEqual([3, 3])
})

it("Multiplies vectors by a scalar value", () => {
    const a = [1, 0]
    expect(Vec.multiply(a, 5)).toEqual([5, 0])
})

it("Checks if a point is in bounds", () => {
    const posIn = [5, 5]
    const posOut1 = [-1, 5]
    const posOut2 = [11, 5]
    const a = [0, 0]
    const b = [10, 10]
    expect(Vec.inBounds(posIn, a, b)).toBeTruthy()
    expect(Vec.inBounds(posOut1, a, b)).toBeFalsy()
    expect(Vec.inBounds(posOut2, a, b)).toBeFalsy()
})

it("rotates vectors 90 degrees to the right", () => {
    let direction = [1, 0]
    direction = Vec.rotateRight(direction)
    expect(direction).toEqual([0, 1])
    direction = Vec.rotateRight(direction)
    expect(direction).toEqual([-1, 0])
    direction = Vec.rotateRight(direction)
    expect(direction).toEqual([0, -1])
    direction = Vec.rotateRight(direction)
    expect(direction).toEqual([1, 0])
})

it("rotates vectors 90 degrees to the left", () => {
    let direction = [1, 0]
    direction = Vec.rotateLeft(direction)
    expect(direction).toEqual([0, -1])
    direction = Vec.rotateLeft(direction)
    expect(direction).toEqual([-1, 0])
    direction = Vec.rotateLeft(direction)
    expect(direction).toEqual([0, 1])
    direction = Vec.rotateLeft(direction)
    expect(direction).toEqual([1, 0])
})

it("return directions for unit vectors", () => {
    const right = [1, 0]
    const down = Vec.rotateRight(right)
    const left = Vec.rotateRight(down)
    const up = Vec.rotateRight(left)
    expect(Vec.getDirection(right)).toBe("r")
    expect(Vec.getDirection(down)).toBe("d")
    expect(Vec.getDirection(left)).toBe("l")
    expect(Vec.getDirection(up)).toBe("u")
})
