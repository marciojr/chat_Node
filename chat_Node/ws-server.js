var WebSocketServer = new require('ws').Server
var webSocketServer = new WebSocketServer({port:9090})

var Clients = new require('./clients.js').Clients
var clients = new Clients()

webSocketServer.on('connection', function(webSocket){
	console.log('new Client Connected')
	clients.addClient(webSocket)

	webSocket.on('message', function(msg){
		console.log('Msg de: ' + clients.getClientBySocket(webSocket) + ' (' + msg + ')')
		if (clients.command(msg, webSocket)) {
            return
        }
        clients.sendToAllFromClient(msg, webSocket)
	})

	webSocket.on('close', function() {
        console.log('closed connection')
        clients.sendToAllFromClient(clients.getClientBySocket(webSocket) + ' saiu do Chat...', webSocket)
    })
})