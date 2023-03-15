
const MiscFuncs = (function() {
    const numToLetter = function(num) {
        const A = "A".charCodeAt(0)
        return String.fromCharCode(A + num)
    }

    return {numToLetter}
})()

module.exports = MiscFuncs
