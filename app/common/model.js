var C = require("./controller")

function Model(name, obj) {
	return C(name, obj)
}

module.exports = Model;