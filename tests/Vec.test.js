const Vec = require("Vec")

it("Checks if two vectors are equal", () => {
    const a = [1, 2]
    const b = [1, 2]
    const c = [0, 2]
    expect(Vec.equal(a, b)).toBeTruthy()
    expect(Vec.equal(a, c)).toBeFalsy()
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
