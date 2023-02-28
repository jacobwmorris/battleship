const Vec = require("Vec")

it("Checks if two vectors are equal", () => {
    const a = [1, 2]
    const b = [1, 2]
    const c = [0, 2]
    expect(Vec.equal(a, b)).toBeTruthy()
    expect(Vec.equal(a, c)).toBeFalsy()
})
