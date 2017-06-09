var Client = require('./client.js').Client

module.exports.Clients = function(){
	var clients = new Array()
	var clientCounter = 0

	this.sendToClient = function (client, msg) {
        try {
            client.send(msg)
        }
        catch (error) {
            console.log(error)
        }
    }

	this.forEachClient = function(callBack){
		for (var i = clients.length - 1; i >= 0; i--) {
			if (!clients[i]) {
                clients.splice(i, 1)
                continue
            }

            callBack(clients[i], i)
		};
	}

	this.getClientByName = function (name) {
        for (var i = clients.length - 1; i >= 0; i--) {
            if (clients[i].name == name) {
                return clients[i]
            }
        }
        return null
    }

    this.getClientBySocket = function (socket) {
        for (var i = clients.length - 1; i >= 0; i--) {
            if (clients[i].socket == socket) {
                return clients[i]
            }
        }
        return null
    }

    this.addClient = function (socket) {
        var client = new Client('User_' + ++clientCounter, socket)
        clients.push(client)
        console.log(client.name + ' adicionado...')
        this.sendToClient(client, '/welcome ' + client)
        this.sendToAll('/users ' + clients.join(' '))
        this.sendToAll('/newUser ' + client.name)
        return client
    }

    this.removeClient = function (socket, name) {
        var removedClients = new Array()
        for (var i = clients.length - 1; i >= 0; i--) {
            if (socket && clients[i].socket == socket) {
                removedClients.push(clients[i])
                clients.splice(i, 1)
            }
            if (name && clients[i].name == name) {
                removedClients.push(clients[i])
                clients.splice(i, 1)
            }
        }

        for (var i = removedClients.length - 1; i >= 0; i--) {
            this.sendToAll('/removed ' + removedClients[i])
        }
    }

    this.sendToAll = function (msg) {
        var thath = this
        this.forEachClient(function (client, i) {
            thath.sendToClient(client, msg)
        })
    }

    this.sendToAllFromClient = function (msg, socket) {
        var sender = this.getClientBySocket(socket)
        var thath = this

        this.forEachClient(function (client, i) {
            if (sender == client) {
                return
            }

            thath.sendToClient(client, sender + ': ' + msg)
        })
    }

    this.command = function (msg, socket) {
        if (msg.substr(0, 1) != '/') {
            return false
        }

        var client = this.getClientBySocket(socket)

        var params = msg.split(' ')
        var type = params[0]
        params.splice(0, 1)

        switch (type) {
            case '/name':
                if (!params[0]) {
                    return false
                }
                var oldName = client.name
                client.name = params[0]
                this.sendToAll('/name_change ' + oldName + ' ' + client.name)
                break
        }
        return true
    }

}