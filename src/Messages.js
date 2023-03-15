const Dom = require("./DomFuncs")

function Messages(element) {
    this.element = element
}

Messages.prototype.receiveMessage = function(text, player) {
    if (!player) {
        this.element.appendChild(Dom.makeElement("p", text))
    }

    const colorClass = (player === 1) ? "redtext" : "bluetext"
    this.element.appendChild(Dom.makeElement("p", text, colorClass))
}

Messages.prototype.clear = function() {
    Dom.clearChildren(this.element)
}
