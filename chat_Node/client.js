module.exports.Client = function (name, socket) {
	this.name = name
	this.socket = socket

	this.send = function (msg) {
		this.socket.send(msg)
	}

	this.toString = function (msg) {
		return this.name
	}
}