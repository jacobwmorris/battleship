const Gamedata = require("Gamedata")

const mockDisplay = {
    setup: function(data) {
        console.log("display set up")
    },

    update: function(data) {
        console.log("display updated")
    }
}

const mockMessages = {
    receiveMessage: function(text, player) {
        console.log(text)
    }
}

const mockCursor = {
    setupRotationCb: function(cursorObj) {
        return
    },

    update: function(data) {
        console.log("placing cursor updated")
    }
}

it("Does a player move, followed by a computer move", () => {
    const g = new Gamedata()
    g.setup(1, "p1", "p2", mockDisplay, mockMessages, mockCursor)
    g.board1.place("test ship", [0, 0], 2, [1, 0])
    g.board2.place("test ship", [0, 0], 2, [1, 0])
    g.mode = "pvc"
    g.update({boardNum: 2, pos: [0, 0]})
    expect(g.board1.shots.length).toBe(1)
    expect(g.board2.shots.length).toBe(1)
})
