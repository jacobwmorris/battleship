const SmartGuesser = require("SmartGuesser")
const Gameboard = require("Gameboard")

function setupBoard(shipLoc, shipLen) {
    const board = new Gameboard()
    board.place("test ship", shipLoc, shipLen, [0, 1])
    return board
}

function nonRandomGuesser(start) {
    let x = start[0]
    let y = start[1]

    return (function(board) {
        guess = [x, y]
        x += 1
        if (x >= board.width) {
            x = 0
            y += 1
            if (y >= board.height) {
                y = 0
            }
        }
        return guess
    })
}

it("Guesses at random until finding a ship", () => {
    const board = setupBoard([2, 2], 3)
    const smrt = new SmartGuesser(nonRandomGuesser([0, 3]))
    expect(smrt.guess(board)).toEqual([0, 3])
    expect(smrt.guess(board)).toEqual([1, 3])
    expect(smrt.guess(board)).toEqual([2, 3])
    expect(smrt.mode).not.toBe("rand")
})

it("Guesses surrounding squares after finding a ship", () => {
    const board = setupBoard([9, 0], 3)
    const smrt = new SmartGuesser(nonRandomGuesser([0, 2]))
    while (smrt.mode !== "surround") {
        board.receiveAttack(smrt.guess(board))
    }
    expect(smrt.guess(board)).toEqual([9, 3])
    expect(smrt.guess(board)).toEqual([9, 1])
    expect(smrt.mode).not.toBe("surround")
})

it("Guesser traces a ship after finding its direction", () => {
    const board = setupBoard([1, 0], 3)
    const smrt = new SmartGuesser(nonRandomGuesser([0, 0]))
    while (smrt.mode !== "trace") {
        board.receiveAttack(smrt.guess(board))
    }
    expect(smrt.guess(board)).toEqual([1, 2])
    expect(smrt.mode).not.toBe("trace")
})

it("Guesser tries both sides of an unsunk ship", () => {
    const board = setupBoard([1, 0], 3)
    const smrt = new SmartGuesser(nonRandomGuesser([0, 1]))
    while (smrt.mode !== "trace") {
        board.receiveAttack(smrt.guess(board))
    }
    expect(smrt.guess(board)).toEqual([1, 3])
    board.receiveAttack([1, 3])
    expect(smrt.guess(board)).toEqual([1, 0])
    expect(smrt.mode).not.toBe("trace")
})
