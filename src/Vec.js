const Vec = {
    equal: function(a, b) {
        return (a[0] === b[0]) && (a[1] === b[1])
    },

    add: function(a, b) {
        return [a[0] + b[0], a[1] + b[1]]
    },

    multiply: function(a, b) {
        return [a[0] * b, a[1] * b]
    },

    inBounds: function(pos, a, b) {
        return pos[0] >= a[0] && pos[0] <= b[0] && pos[1] >= a[1] && pos[1] <= b[1]
    }
}

module.exports = Vec
