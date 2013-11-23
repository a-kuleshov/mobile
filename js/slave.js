function prepare_socket() {
	socket.onerror = function(error) {
		document.getElementById("label").innerHTML = "Возникли какие-то трудности";
	};
	socket.onclose = function (e) {
		document.getElementById("label").innerHTML = "Соединение закрыто";
	};
}

function get_token (form) {
	var data = JSON.stringify({
		action : "give_me_token",
		ip : ip,
	});
	socket.onmessage = wait_token;
	socket.send(data);
}

function wait_token (event) {
	var msg = event.data;
	var node = document.getElementById("main").innerHTML = msg;
	this.onmessage = wait_of_master;
}

function wait_of_master (event) {
	var msg = event.data;
	if (msg == 'Partner_connected') {
		console.log(msg);
		this.onmessage = wait_command;
	}
}

function wait_command (event) {
	console.log(event.data);
}
