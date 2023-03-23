const Dom = require("./DomFuncs")

function Messages(element) {
    this.element = element
}

Messages.prototype.receiveMessage = function(text, player) {
    let p
    if (!player) {
        p = Dom.makeElement("p", text)
        this.element.appendChild(p)
    }
    else {
        const colorClass = (player === 1) ? "redtext" : "bluetext"
        p = Dom.makeElement("p", text, colorClass)
        this.element.appendChild(p)
    }
    this.element.scrollTop += p.scrollHeight
}

Messages.prototype.clear = function() {
    Dom.clearChildren(this.element)
}

module.exports = Messages
