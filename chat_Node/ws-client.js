var webSocket = new WebSocket('ws://localhost:9090')

function $(elementId) {return document.getElementById(elementId)}
var chatArea = $('chat_area')
var chatForm = $('char_form')
var chatInput = $('chat_input')
var usersArea = $('users_area')

var messageCounter = 0
var myName = null

function addMessage(msg,type){
	var newMessage = document.createElement('li')
	newMessage.textContent = newMessage.innerText = msg
	newMessage.setAttribute('id','msg_' + messageCounter)
	newMessage.setAttribute('class',type)
	chatArea.appendChild(newMessage)
	chatArea.scrollTop = chatArea.scrollHeight

	if(messageCounter > 20){
		oldMessage = $('msg_' + (messageCounter - 21))
		chatArea.removeChild(oldMessage)
	}
	messageCounter++
}

function addUser (users) { 
	for (var i = users.length - 1; i >= 0; i--) {
		var userName = users[i]
		if ($('user_' + userName)) {
			continue
		}
		var newUser = document.createElement('li')
		newUser.textContent = newUser.innerText = userName
		newUser.setAttribute('id', 'user_' + userName)

		if (myName == userName) {
			newUser.setAttribute('class', 'own')
		}

		newUser.onclick = function () {
			if (this.getAttribute('class') == 'own') {
				webSocket.send('/name ' + prompt('Escolha seu nome para o chat: ', myName))

			}
		}
		usersArea.appendChild(newUser)
	}
}

function changeUserName (from, to) {
	var user = $('user_' + from);
	user.textContent = user.innerText = to
	user.setAttribute('id', 'user_' + to)
	if (from == myName) {
		myName = to
	}
}

function removeUser (userName) {
	usersArea.removeChild($('user_' + userName))
}

function command(msg) {
	if (msg.substr(0, 1) != '/') {
		return false
	}

	var params = msg.split(' ')
	var type = params[0]
	params.splice(0, 1)

	switch (type) {
		case '/users':
			addUser(params)
			break
		case '/removed':
			removeUser(params)
			break
		case '/welcome':
			myName = params[0]
			break
		case '/name_change':
			changeUserName(params[0], params[1])
			addMessage('Usuário ' + params[0] + ' alterou seu nome para ' + params[1] +' ...')
			break
		case '/newUser':
			addMessage('Usuário ' + params[0] + ' entrou no chat...\n Clique no seu nome ao lado para alterá-lo...')
			break
	}
	return true
}

webSocket.onmessage = function (msg) {
	if (command(msg.data)) {
		return
	}
	addMessage(msg.data, 'public')
}

chatForm.onsubmit = function(form) {
	if (chatInput.value == '') {
		return false
	}

	webSocket.send(chatInput.value)
	addMessage(chatInput.value, 'own')
	chatInput.value = ''
	return false
}



