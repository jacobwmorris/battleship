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

    //Note: includes a, excludes b
    inBounds: function(pos, a, b) {
        return pos[0] >= a[0] && pos[0] < b[0] && pos[1] >= a[1] && pos[1] < b[1]
    },

    rotateRight: function(v) {
        return this.removeNegativeZero([-v[1], v[0]])
    },

    rotateLeft: function(v) {
        return this.removeNegativeZero([v[1], -v[0]])
    },

    removeNegativeZero: function(v) {
        return v.map((n) => (n === -0) ? 0 : n)
    }
}

module.exports = Vec
